/**
 * Modelo EntregasInsumos
 *
 * Codigo distribuido desde entities.models.js. Tras la migracion,
 * entities.models.js permanece intacto pero desconectado: ningun consumidor
 * lo importa. La fuente activa es este archivo modular.
 */
const pool = require('../../../db');
const { ensureMotivoEstado } = require('../shared/auditoria');

const EntregasInsumos = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT ei.*, i.nombre as insumo_nombre, CONCAT(COALESCE(u.nombre, ''), ' ', COALESCE(u.apellido, '')) as operario_nombre
      FROM entregas_insumos ei
      JOIN insumos i ON ei.insumo_id = i.id
      LEFT JOIN usuarios u ON ei.operario_id = u.id
      ORDER BY ei.fecha DESC
    `);
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query(`
      SELECT ei.*, i.nombre as insumo_nombre, CONCAT(COALESCE(u.nombre, ''), ' ', COALESCE(u.apellido, '')) as operario_nombre
      FROM entregas_insumos ei
      JOIN insumos i ON ei.insumo_id = i.id
      LEFT JOIN usuarios u ON ei.operario_id = u.id
      WHERE ei.id = $1
    `, [id]);
    return result.rows[0];
  },
  create: async (data) => {
    if (!data.numero_entrega || !String(data.numero_entrega).trim()) {
      const error = new Error('El número de entrega es obligatorio');
      error.statusCode = 400;
      throw error;
    }
    if (!data.insumo_id || data.insumo_id <= 0) {
      const error = new Error('El ID del insumo es obligatorio y debe ser válido');
      error.statusCode = 400;
      throw error;
    }
    const cantidad = Number(data?.cantidad) || 0;
    if (cantidad <= 0) {
      const error = new Error('La cantidad debe ser un valor positivo');
      error.statusCode = 400;
      throw error;
    }
    const unidad = String(data?.unidad || '').trim();
    const unidadesValidas = ['Litros', 'Kilogramos', 'Gramos', 'Unidades', 'Cajas', 'Botellas', 'Mililitros'];
    if (!unidad || !unidadesValidas.includes(unidad)) {
      const error = new Error(`Unidad inválida. Valores permitidos: ${unidadesValidas.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    if (!data.operario_id || data.operario_id <= 0) {
      const error = new Error('El productor es obligatorio');
      error.statusCode = 400;
      throw error;
    }
    if (!data.fecha) {
      const error = new Error('La fecha es obligatoria');
      error.statusCode = 400;
      throw error;
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        'INSERT INTO entregas_insumos (numero_entrega, insumo_id, cantidad, unidad, operario_id, fecha, hora) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [data.numero_entrega, data.insumo_id, cantidad, unidad, data.operario_id, data.fecha, data.hora || null]
      );
      await client.query(
        'UPDATE insumos SET cantidad = COALESCE(cantidad, 0) + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [cantidad, data.insumo_id]
      );
      await client.query('COMMIT');
      return result.rows[0].id;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
  update: async (id, data) => {
    const current = await EntregasInsumos.getById(id);
    if (!current) {
      const error = new Error('Entrega no encontrada');
      error.statusCode = 404;
      throw error;
    }
    const cantidad = data.cantidad !== undefined ? Number(data.cantidad) : current.cantidad;
    if (cantidad <= 0) {
      const error = new Error('La cantidad debe ser un valor positivo');
      error.statusCode = 400;
      throw error;
    }
    const unidad = data.unidad !== undefined ? String(data.unidad).trim() : current.unidad;
    const unidadesValidas = ['Litros', 'Kilogramos', 'Gramos', 'Unidades', 'Cajas', 'Botellas', 'Mililitros'];
    if (!unidadesValidas.includes(unidad)) {
      const error = new Error(`Unidad inválida. Valores permitidos: ${unidadesValidas.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    const operarioId = data.operario_id !== undefined ? data.operario_id : current.operario_id;
    if (!operarioId || operarioId <= 0) {
      const error = new Error('El productor es obligatorio');
      error.statusCode = 400;
      throw error;
    }
    const newInsumoId = data.insumo_id !== undefined ? Number(data.insumo_id) : Number(current.insumo_id);
    if (!Number.isFinite(newInsumoId) || newInsumoId <= 0) {
      const error = new Error('El insumo es obligatorio y debe ser válido');
      error.statusCode = 400;
      throw error;
    }

    const oldInsumo = Number(current.insumo_id);
    const oldCant = Number(current.cantidad);
    const newInsumo = newInsumoId;
    const newCant = Number(cantidad);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT id FROM entregas_insumos WHERE id = $1 FOR UPDATE', [id]);

      if (oldInsumo === newInsumo) {
        const delta = newCant - oldCant;
        if (delta !== 0) {
          const up = await client.query(
            `UPDATE insumos SET cantidad = COALESCE(cantidad, 0) + $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND COALESCE(cantidad, 0) + $1 >= 0
             RETURNING id`,
            [delta, oldInsumo]
          );
          if (up.rowCount === 0) {
            const err = new Error(
              'No se puede actualizar la entrega: el inventario del insumo quedaría negativo'
            );
            err.statusCode = 409;
            throw err;
          }
        }
      } else {
        const rev = await client.query(
          `UPDATE insumos SET cantidad = COALESCE(cantidad, 0) - $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2 AND COALESCE(cantidad, 0) >= $1
           RETURNING id`,
          [oldCant, oldInsumo]
        );
        if (rev.rowCount === 0) {
          const err = new Error(
            'No se puede actualizar la entrega: el inventario del insumo original quedaría negativo'
          );
          err.statusCode = 409;
          throw err;
        }
        const add = await client.query(
          `UPDATE insumos SET cantidad = COALESCE(cantidad, 0) + $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2
           RETURNING id`,
          [newCant, newInsumo]
        );
        if (add.rowCount === 0) {
          const err = new Error('Insumo destino no encontrado');
          err.statusCode = 404;
          throw err;
        }
      }

      await client.query(
        'UPDATE entregas_insumos SET insumo_id = $1, cantidad = $2, unidad = $3, operario_id = $4, fecha = $5, hora = $6 WHERE id = $7',
        [newInsumo, newCant, unidad, operarioId, data.fecha || current.fecha, data.hora || current.hora, id]
      );
      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
  delete: async (id) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const row = await client.query('SELECT * FROM entregas_insumos WHERE id = $1 FOR UPDATE', [id]);
      if (!row.rows[0]) {
        await client.query('ROLLBACK');
        const error = new Error('Entrega no encontrada');
        error.statusCode = 404;
        throw error;
      }
      const e = row.rows[0];
      const sub = await client.query(
        `UPDATE insumos SET cantidad = COALESCE(cantidad, 0) - $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND COALESCE(cantidad, 0) >= $1
         RETURNING id`,
        [Number(e.cantidad), e.insumo_id]
      );
      if (sub.rowCount === 0) {
        await client.query('ROLLBACK');
        const err = new Error(
          'No se puede eliminar la entrega: el inventario del insumo quedaría negativo'
        );
        err.statusCode = 409;
        throw err;
      }
      await client.query('DELETE FROM entregas_insumos WHERE id = $1', [id]);
      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
};

module.exports = EntregasInsumos;
