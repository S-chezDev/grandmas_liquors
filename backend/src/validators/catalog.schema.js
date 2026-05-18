const { z } = require('zod');
const { motivoEstadoBody } = require('./common.schema');

const createCategoriaBody = z
  .object({
    nombre: z.string().trim().min(1),
    descripcion: z.string().optional(),
    estado: z.enum(['Activo', 'Inactivo']).optional(),
  })
  .passthrough();

const updateCategoriaBody = createCategoriaBody.partial().passthrough();

const createProductoBody = z
  .object({
    nombre: z.string().trim().min(1),
    categoria_id: z.coerce.number().int().positive().optional(),
    precio: z.coerce.number().nonnegative().optional(),
    stock: z.coerce.number().int().nonnegative().optional(),
    estado: z.enum(['Activo', 'Inactivo']).optional(),
  })
  .passthrough();

const updateProductoBody = createProductoBody.partial().passthrough();

const createProveedorBody = z
  .object({
    nombre: z.string().trim().min(1),
    nit: z.string().trim().optional(),
    telefono: z.string().trim().optional(),
    email: z.string().trim().email().optional(),
    direccion: z.string().trim().optional(),
    estado: z.enum(['Activo', 'Inactivo']).optional(),
  })
  .passthrough();

const updateProveedorBody = createProveedorBody.partial().passthrough();

const createCompraBody = z
  .object({
    proveedor_id: z.coerce.number().int().positive().optional(),
    fecha: z.string().trim().optional(),
    total: z.coerce.number().nonnegative().optional(),
    estado: z.string().trim().optional(),
    productos: z.array(z.record(z.unknown())).optional(),
  })
  .passthrough();

const updateCompraBody = createCompraBody.partial().passthrough();

const updateCompraEstadoBody = z.object({
  estado: z.string().trim().min(1),
  motivo: z.string().trim().optional(),
});

const addProductoCompraBody = z.object({
  compraId: z.coerce.number().int().positive().optional(),
  compra_id: z.coerce.number().int().positive().optional(),
  productoId: z.coerce.number().int().positive().optional(),
  producto_id: z.coerce.number().int().positive().optional(),
  cantidad: z.coerce.number().positive(),
  precioUnitario: z.coerce.number().nonnegative().optional(),
});

const createInsumoBody = z
  .object({
    nombre: z.string().trim().min(1),
    unidad: z.string().trim().optional(),
    stock: z.coerce.number().nonnegative().optional(),
    estado: z.enum(['Activo', 'Inactivo']).optional(),
  })
  .passthrough();

const updateInsumoBody = createInsumoBody.partial().passthrough();

const entregaInsumoBaseBody = z
  .object({
    numero_entrega: z.string().trim().min(1).optional(),
    cantidad: z.coerce.number().positive().optional(),
    unidad: z.enum(['Litros', 'Kilogramos', 'Gramos', 'Unidades', 'Cajas', 'Botellas', 'Mililitros']).optional(),
    operario_id: z.coerce.number().int().positive().optional(),
    fecha: z.string().trim().min(1).optional(),
    hora: z.string().trim().optional(),
    insumo_id: z.coerce.number().int().positive().optional(),
    producto_catalogo_id: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

const createEntregaInsumoBody = z
  .object({
    numero_entrega: z.string().trim().min(1),
    cantidad: z.coerce.number().positive(),
    unidad: z.enum(['Litros', 'Kilogramos', 'Gramos', 'Unidades', 'Cajas', 'Botellas', 'Mililitros']),
    operario_id: z.coerce.number().int().positive(),
    fecha: z.string().trim().min(1),
    hora: z.string().trim().optional(),
    insumo_id: z.coerce.number().int().positive().optional(),
    producto_catalogo_id: z.coerce.number().int().positive().optional(),
  })
  .refine(
    (data) => data.insumo_id || data.producto_catalogo_id,
    { message: 'Debe especificar insumo_id o producto_catalogo_id' }
  )
  .passthrough();

const updateEntregaInsumoBody = entregaInsumoBaseBody;

module.exports = {
  createCategoriaBody,
  updateCategoriaBody,
  updateCategoriaEstadoBody: motivoEstadoBody,
  createProductoBody,
  updateProductoBody,
  updateProductoEstadoBody: motivoEstadoBody,
  createProveedorBody,
  updateProveedorBody,
  updateProveedorEstadoBody: motivoEstadoBody,
  createCompraBody,
  updateCompraBody,
  updateCompraEstadoBody,
  addProductoCompraBody,
  createInsumoBody,
  updateInsumoBody,
  updateInsumoEstadoBody: motivoEstadoBody,
  createEntregaInsumoBody,
  updateEntregaInsumoBody,
};
