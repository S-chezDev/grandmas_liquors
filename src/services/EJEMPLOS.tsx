/**
 * EJEMPLOS DE USO - API Service
 * Archivo: src/services/EJEMPLOS.tsx
 * 
 * Este archivo muestra cómo usar las funciones del servicio API
 * en tus componentes React
 */

import { useState, useEffect } from 'react';
import {
  categorias,
  productos,
  clientes,
  proveedores,
  pedidos,
  ventas,
  abonos,
  domicilios,
  compras,
  insumos,
  entregas_insumos,
  produccion,
} from './api';

// ==================== EJEMPLO 1: Obtener todas las categorías ====================
export function EjemploObtenerCategorias() {
  const [categoriasList, setCategoriasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setLoading(true);
        const datos = await categorias.getAll();
        setCategoriasList(datos);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarCategorias();
  }, []);

  if (loading) return <div>Cargando categorías...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Categorías</h2>
      <ul>
        {categoriasList.map((cat) => (
          <li key={cat.id}>
            {cat.nombre} - {cat.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==================== EJEMPLO 2: Crear una nueva categoría ====================
export function EjemploCrearCategoria() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [creando, setCreando] = useState(false);

  const handleCrear = async () => {
    try {
      setCreando(true);
      const nuevaCategoria = {
        nombre,
        descripcion,
        estado: 'Activo',
      };

      const resultado = await categorias.create(nuevaCategoria);
      console.log('Categoría creada:', resultado);
      alert('Categoría creada exitosamente');
      
      // Limpiar formulario
      setNombre('');
      setDescripcion('');
    } catch (error) {
      console.error('Error al crear categoría:', error);
      alert('Error al crear categoría');
    } finally {
      setCreando(false);
    }
  };

  return (
    <div>
      <h2>Crear Nueva Categoría</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <button onClick={handleCrear} disabled={creando}>
        {creando ? 'Creando...' : 'Crear Categoría'}
      </button>
    </div>
  );
}

// ==================== EJEMPLO 3: Obtener productos por categoría ====================
export function EjemploObtenerProductosPorCategoria() {
  const [categoriaId, setCategoriaId] = useState<number>(1);
  const [productosList, setProductosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const datos = await productos.getByCategory(categoriaId);
      setProductosList(datos);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Productos por Categoría</h2>
      <div>
        <input
          type="number"
          value={categoriaId}
          onChange={(e) => setCategoriaId(Number(e.target.value))}
        />
        <button onClick={cargarProductos} disabled={loading}>
          {loading ? 'Cargando...' : 'Cargar'}
        </button>
      </div>
      <ul>
        {productosList.map((prod) => (
          <li key={prod.id}>
            {prod.nombre} - ${prod.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==================== EJEMPLO 4: Crear un nuevo cliente ====================
export function EjemploCrearCliente() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCrear = async () => {
    try {
      const resultado = await clientes.create(formData);
      console.log('Cliente creado:', resultado);
      alert('Cliente creado exitosamente');
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellido: '',
        documento: '',
        email: '',
        telefono: '',
        direccion: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear cliente');
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Cliente</h2>
      <input
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
      />
      <input
        name="apellido"
        placeholder="Apellido"
        value={formData.apellido}
        onChange={handleChange}
      />
      <input
        name="documento"
        placeholder="Documento"
        value={formData.documento}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="telefono"
        placeholder="Teléfono"
        value={formData.telefono}
        onChange={handleChange}
      />
      <textarea
        name="direccion"
        placeholder="Dirección"
        value={formData.direccion}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            direccion: e.target.value,
          }))
        }
      />
      <button onClick={handleCrear}>Crear Cliente</button>
    </div>
  );
}

// ==================== EJEMPLO 5: Listar todos los clientes ====================
export function EjemploListarClientes() {
  const [clientesList, setClientesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await clientes.getAll();
        setClientesList(datos);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Lista de Clientes</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Documento</th>
          </tr>
        </thead>
        <tbody>
          {clientesList.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre} {cliente.apellido}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.documento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==================== EJEMPLO 6: Crear un nuevo producto ====================
export function EjemploCrearProducto() {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria_id: 1,
    descripcion: '',
    precio: 0,
    stock: 0,
    stock_minimo: 10,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleCrear = async () => {
    try {
      const resultado = await productos.create(formData);
      console.log('Producto creado:', resultado);
      alert('Producto creado exitosamente');
      // Limpiar
      setFormData({
        nombre: '',
        categoria_id: 1,
        descripcion: '',
        precio: 0,
        stock: 0,
        stock_minimo: 10,
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear producto');
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Producto</h2>
      <input
        name="nombre"
        placeholder="Nombre del producto"
        value={formData.nombre}
        onChange={handleChange}
      />
      <select
        name="categoria_id"
        value={formData.categoria_id}
        onChange={handleChange}
      >
        <option value={1}>Categoría 1</option>
        <option value={2}>Categoría 2</option>
        <option value={3}>Categoría 3</option>
      </select>
      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={formData.descripcion}
        onChange={handleChange}
      />
      <input
        name="precio"
        placeholder="Precio"
        type="number"
        step="0.01"
        value={formData.precio}
        onChange={handleChange}
      />
      <input
        name="stock"
        placeholder="Stock"
        type="number"
        value={formData.stock}
        onChange={handleChange}
      />
      <input
        name="stock_minimo"
        placeholder="Stock Mínimo"
        type="number"
        value={formData.stock_minimo}
        onChange={handleChange}
      />
      <button onClick={handleCrear}>Crear Producto</button>
    </div>
  );
}

// ==================== EJEMPLO 7: Actualizar un producto ====================
export function EjemploActualizarProducto() {
  const [id, setId] = useState<number>(1);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    stock: 0,
  });

  const handleActualizar = async () => {
    try {
      const resultado = await productos.update(id, formData);
      console.log('Producto actualizado:', resultado);
      alert('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar');
    }
  };

  return (
    <div>
      <h2>Actualizar Producto</h2>
      <input
        type="number"
        placeholder="ID del Producto"
        value={id}
        onChange={(e) => setId(Number(e.target.value))}
      />
      <input
        placeholder="Nuevo Nombre"
        value={formData.nombre}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            nombre: e.target.value,
          }))
        }
      />
      <input
        type="number"
        placeholder="Nuevo Precio"
        step="0.01"
        value={formData.precio}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            precio: Number(e.target.value),
          }))
        }
      />
      <input
        type="number"
        placeholder="Nuevo Stock"
        value={formData.stock}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            stock: Number(e.target.value),
          }))
        }
      />
      <button onClick={handleActualizar}>Actualizar</button>
    </div>
  );
}

// ==================== EJEMPLO 8: Eliminar un producto ====================
export function EjemploEliminarProducto() {
  const [id, setId] = useState<number>(1);

  const handleEliminar = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto ${id}?`)) {
      try {
        await productos.delete(id);
        alert('Producto eliminado exitosamente');
        setId(1);
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar');
      }
    }
  };

  return (
    <div>
      <h2>Eliminar Producto</h2>
      <input
        type="number"
        placeholder="ID del Producto"
        value={id}
        onChange={(e) => setId(Number(e.target.value))}
      />
      <button onClick={handleEliminar} style={{ backgroundColor: 'red', color: 'white' }}>
        Eliminar
      </button>
    </div>
  );
}

// ==================== EJEMPLO 9: Buscar cliente por documento ====================
export function EjemploBuscarClientePorDocumento() {
  const [documento, setDocumento] = useState('');
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    try {
      setLoading(true);
      const datos = await clientes.getByDocumento(documento);
      setCliente(datos);
    } catch (error) {
      console.error('Error:', error);
      setCliente(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Buscar Cliente por Documento</h2>
      <input
        placeholder="Documento"
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
      />
      <button onClick={handleBuscar} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {cliente && (
        <div>
          <h3>Cliente encontrado:</h3>
          <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
          <p>Email: {cliente.email}</p>
          <p>Teléfono: {cliente.telefono}</p>
          <p>Dirección: {cliente.direccion}</p>
        </div>
      )}
    </div>
  );
}

// ==================== EJEMPLO 10: Listar todas las ventas ====================
export function EjemploListarVentas() {
  const [ventasList, setVentasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await ventas.getAll();
        setVentasList(datos);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Lista de Ventas</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número Venta</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {ventasList.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.id}</td>
              <td>{venta.numero_venta}</td>
              <td>{venta.cliente_nombre}</td>
              <td>{venta.fecha}</td>
              <td>${venta.total}</td>
              <td>{venta.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
