const pool = require('../../db');

exports.getStaffResumen = async (_req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const y = new Date().getFullYear();
    const m = new Date().getMonth() + 1;

    const ventasMes = await pool.query(
      `SELECT COALESCE(SUM(total), 0)::numeric AS total
       FROM ventas
       WHERE TRIM(LOWER(estado)) IN ('completada', 'completado')
         AND EXTRACT(YEAR FROM fecha::date) = $1
         AND EXTRACT(MONTH FROM fecha::date) = $2`,
      [y, m]
    );

    const ventasHoy = await pool.query(
      `SELECT COALESCE(SUM(total), 0)::numeric AS total
       FROM ventas
       WHERE TRIM(LOWER(estado)) IN ('completada', 'completado')
         AND fecha::date = $1::date`,
      [today]
    );

    const pedidosActivos = await pool.query(
      `SELECT COUNT(*)::int AS c
       FROM pedidos
       WHERE TRIM(estado) NOT IN ('Completado', 'Cancelado')`
    );

    const clientesActivos = await pool.query(
      `SELECT COUNT(*)::int AS c FROM clientes WHERE TRIM(estado) = 'Activo'`
    );

    const ventasMensuales = await pool.query(
      `SELECT TO_CHAR(fecha::date, 'Mon YYYY') AS label,
              TO_CHAR(fecha::date, 'YYYY-MM') AS orden,
              COALESCE(SUM(total), 0)::numeric AS ventas
       FROM ventas
       WHERE TRIM(LOWER(estado)) IN ('completada', 'completado')
         AND fecha::date >= (CURRENT_DATE - INTERVAL '6 months')
       GROUP BY TO_CHAR(fecha::date, 'Mon YYYY'), TO_CHAR(fecha::date, 'YYYY-MM')
       ORDER BY orden ASC`
    );

    const categoriaDistribucion = await pool.query(
      `SELECT c.nombre AS name, COALESCE(SUM(dv.subtotal), 0)::numeric AS value
       FROM detalle_ventas dv
       JOIN ventas v ON v.id = dv.venta_id
       JOIN productos p ON p.id = dv.producto_id
       JOIN categorias c ON c.id = p.categoria_id
       WHERE TRIM(LOWER(v.estado)) IN ('completada', 'completado')
         AND v.fecha::date >= (CURRENT_DATE - INTERVAL '12 months')
       GROUP BY c.id, c.nombre
       ORDER BY value DESC`
    );

    const productosMasVendidos = await pool.query(
      `SELECT p.nombre AS name,
              SUM(dv.cantidad)::int AS quantity,
              COALESCE(SUM(dv.subtotal), 0)::numeric AS sales
       FROM detalle_ventas dv
       JOIN ventas v ON v.id = dv.venta_id
       JOIN productos p ON p.id = dv.producto_id
       WHERE TRIM(LOWER(v.estado)) IN ('completada', 'completado')
       GROUP BY p.id, p.nombre
       ORDER BY quantity DESC
       LIMIT 10`
    );

    const pedidosRecientes = await pool.query(
      `SELECT p.id,
              p.numero_pedido,
              TRIM(CONCAT(COALESCE(c.nombre, ''), ' ', COALESCE(c.apellido, ''))) AS cliente,
              p.total,
              p.estado,
              p.fecha
       FROM pedidos p
       JOIN clientes c ON c.id = p.cliente_id
       ORDER BY p.id DESC
       LIMIT 8`
    );

    res.json({
      success: true,
      data: {
        ventasMes: Number(ventasMes.rows[0]?.total ?? 0),
        ventasHoy: Number(ventasHoy.rows[0]?.total ?? 0),
        pedidosActivos: pedidosActivos.rows[0]?.c ?? 0,
        clientesActivos: clientesActivos.rows[0]?.c ?? 0,
        ventasMensuales: ventasMensuales.rows.map((r) => ({
          month: r.label,
          orden: r.orden,
          ventas: Number(r.ventas),
        })),
        categoriaDistribucion: categoriaDistribucion.rows.map((r) => ({
          name: r.name,
          value: Number(r.value),
        })),
        productosMasVendidos: productosMasVendidos.rows.map((r) => ({
          name: r.name,
          quantity: r.quantity,
          sales: Number(r.sales),
        })),
        pedidosRecientes: pedidosRecientes.rows.map((r) => ({
          id: String(r.id),
          numero_pedido: r.numero_pedido,
          client: r.cliente?.trim() || '—',
          total: Number(r.total ?? 0),
          status: String(r.estado ?? ''),
          date: r.fecha != null ? String(r.fecha).split('T')[0] : '',
        })),
      },
    });
  } catch (err) {
    console.error('dashboard.getStaffResumen', err);
    res.status(500).json({ success: false, message: err.message || 'Error al cargar el dashboard' });
  }
};
