/**
 * API Service - Conexión con Backend PostgreSQL
 * Archivo: src/services/api.ts
 * 
 * Este archivo contiene todas las funciones para comunicarse con el backend
 * y realizar operaciones CRUD en la base de datos PostgreSQL.
 */

const API_BASE_URL = 'http://localhost:5000';

/**
 * Función genérica para hacer peticiones HTTP
 */
export const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // El backend devuelve { success: true, data: [...] }
    // Extraemos solo el campo 'data' para los componentes
    if (result.success && result.data !== undefined) {
      return result.data;
    }
    
    // Si no tiene la estructura esperada, devolver el resultado completo
    return result;
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
};

// ==================== CATEGORÍAS ====================
export const categorias = {
  getAll: () => apiCall('/api/categorias'),
  getById: (id: number) => apiCall(`/api/categorias/${id}`),
  create: (data: { nombre: string; descripcion?: string; estado?: string }) =>
    apiCall('/api/categorias', 'POST', data),
  update: (id: number, data: { nombre: string; descripcion?: string; estado?: string }) =>
    apiCall(`/api/categorias/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/categorias/${id}`, 'DELETE'),
};

// ==================== PRODUCTOS ====================
export const productos = {
  getAll: () => apiCall('/api/productos'),
  getById: (id: number) => apiCall(`/api/productos/${id}`),
  getByCategory: (categoryId: number) => 
    apiCall(`/api/productos/categoria/${categoryId}`),
  create: (data: {
    nombre: string;
    categoria_id: number;
    descripcion?: string;
    precio: number;
    stock?: number;
    stock_minimo?: number;
    imagen_url?: string;
    estado?: string;
  }) => apiCall('/api/productos', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/productos/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/productos/${id}`, 'DELETE'),
};

// ==================== CLIENTES ====================
export const clientes = {
  getAll: () => apiCall('/api/clientes'),
  getById: (id: number) => apiCall(`/api/clientes/${id}`),
  getByDocumento: (documento: string) =>
    apiCall(`/api/clientes/documento/${documento}`),
  create: (data: {
    nombre: string;
    apellido: string;
    tipoDocumento?: string;
    documento?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    foto_url?: string;
    estado?: string;
  }) => apiCall('/api/clientes', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/clientes/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/clientes/${id}`, 'DELETE'),
};

// ==================== PROVEEDORES ====================
export const proveedores = {
  getAll: () => apiCall('/api/proveedores'),
  getById: (id: number) => apiCall(`/api/proveedores/${id}`),
  create: (data: {
    tipoPersona: string;
    nombreEmpresa?: string;
    nit?: string;
    nombre: string;
    apellido?: string;
    tipoDocumento?: string;
    numeroDocumento?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    estado?: string;
  }) => apiCall('/api/proveedores', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/proveedores/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/proveedores/${id}`, 'DELETE'),
};

// ==================== PEDIDOS ====================
export const pedidos = {
  getAll: () => apiCall('/api/pedidos'),
  getById: (id: number) => apiCall(`/api/pedidos/${id}`),
  getDetalles: (id: number) => apiCall(`/api/pedidos/${id}/detalles`),
  create: (data: {
    numero_pedido: string;
    cliente_id: number;
    fecha: string;
    fecha_entrega?: string;
    detalles?: string;
    estado?: string;
  }) => apiCall('/api/pedidos', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/pedidos/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/pedidos/${id}`, 'DELETE'),
};

// ==================== VENTAS ====================
export const ventas = {
  getAll: () => apiCall('/api/ventas'),
  getById: (id: number) => apiCall(`/api/ventas/${id}`),
  getDetalles: (id: number) => apiCall(`/api/ventas/${id}/detalles`),
  create: (data: {
    numero_venta: string;
    tipo: string;
    cliente_id?: number;
    pedido_id?: number;
    fecha: string;
    metodoPago?: string;
    total?: number;
    estado?: string;
  }) => apiCall('/api/ventas', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/ventas/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/ventas/${id}`, 'DELETE'),
};

// ==================== ABONOS ====================
export const abonos = {
  getAll: () => apiCall('/api/abonos'),
  getById: (id: number) => apiCall(`/api/abonos/${id}`),
  getByPedido: (pedidoId: number) =>
    apiCall(`/api/abonos/pedido/${pedidoId}`),
  create: (data: {
    numero_abono: string;
    pedido_id: number;
    cliente_id: number;
    monto: number;
    fecha: string;
    metodo_pago?: string;
    estado?: string;
  }) => apiCall('/api/abonos', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/abonos/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/abonos/${id}`, 'DELETE'),
};

// ==================== DOMICILIOS ====================
export const domicilios = {
  getAll: () => apiCall('/api/domicilios'),
  getById: (id: number) => apiCall(`/api/domicilios/${id}`),
  getByPedido: (pedidoId: number) =>
    apiCall(`/api/domicilios/pedido/${pedidoId}`),
  create: (data: {
    numero_domicilio: string;
    pedido_id: number;
    cliente_id: number;
    direccion: string;
    repartidor?: string;
    fecha: string;
    hora?: string;
    estado?: string;
    detalle?: string;
  }) => apiCall('/api/domicilios', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/domicilios/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/domicilios/${id}`, 'DELETE'),
};

// ==================== COMPRAS ====================
export const compras = {
  getAll: () => apiCall('/api/compras'),
  getById: (id: number) => apiCall(`/api/compras/${id}`),
  getDetalles: (id: number) => apiCall(`/api/compras/${id}/detalles`),
  create: (data: {
    numero_compra: string;
    proveedor_id: number;
    fecha: string;
    fecha_creacion?: string;
    subtotal?: number;
    iva?: number;
    total?: number;
    estado?: string;
  }) => apiCall('/api/compras', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/compras/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/compras/${id}`, 'DELETE'),
};

// ==================== INSUMOS ====================
export const insumos = {
  getAll: () => apiCall('/api/insumos'),
  getById: (id: number) => apiCall(`/api/insumos/${id}`),
  create: (data: {
    nombre: string;
    descripcion?: string;
    cantidad?: number;
    unidad?: string;
    stock_minimo?: number;
    estado?: string;
  }) => apiCall('/api/insumos', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/insumos/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/insumos/${id}`, 'DELETE'),
};

// ==================== ENTREGAS INSUMOS ====================
export const entregas_insumos = {
  getAll: () => apiCall('/api/entregas-insumos'),
  getById: (id: number) => apiCall(`/api/entregas-insumos/${id}`),
  create: (data: {
    numero_entrega: string;
    insumo_id: number;
    cantidad: number;
    unidad?: string;
    operario?: string;
    fecha: string;
    hora?: string;
  }) => apiCall('/api/entregas-insumos', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/entregas-insumos/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/entregas-insumos/${id}`, 'DELETE'),
};

// ==================== PRODUCCIÓN ====================
export const produccion = {
  getAll: () => apiCall('/api/produccion'),
  getById: (id: number) => apiCall(`/api/produccion/${id}`),
  create: (data: {
    numero_produccion: string;
    producto_id: number;
    cantidad: number;
    fecha: string;
    responsable?: string;
    estado?: string;
    notes?: string;
  }) => apiCall('/api/produccion', 'POST', data),
  update: (id: number, data: any) =>
    apiCall(`/api/produccion/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/produccion/${id}`, 'DELETE'),
};
