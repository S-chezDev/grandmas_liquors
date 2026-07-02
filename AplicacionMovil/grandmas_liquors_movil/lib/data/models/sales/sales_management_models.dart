class SalesOption {
  final int id;
  final String label;

  SalesOption({required this.id, required this.label});
}

class ProductOption {
  final int id;
  final String nombre;
  final double precio;
  final int stock;

  ProductOption({
    required this.id,
    required this.nombre,
    required this.precio,
    required this.stock,
  });
}

class ClienteDetail {
  final int id;
  final String nombre;
  final String apellido;
  final String direccion;
  final String telefono;
  final String estado;

  ClienteDetail({
    required this.id,
    required this.nombre,
    required this.apellido,
    required this.direccion,
    required this.telefono,
    required this.estado,
  });

  String get label => '$nombre $apellido'.trim();
}

class PedidoDetail {
  final int id;
  final int clienteId;
  final double total;
  final double montoAbonado;
  final String esquemaAbono;
  final String metodoPago;
  final String estado;
  final String fechaEntrega;
  final String fechaPedido;
  final String direccion;
  final String telefono;

  PedidoDetail({
    required this.id,
    required this.clienteId,
    required this.total,
    required this.montoAbonado,
    required this.esquemaAbono,
    required this.metodoPago,
    required this.estado,
    required this.fechaEntrega,
    required this.fechaPedido,
    required this.direccion,
    required this.telefono,
  });

  double get saldoPendiente => (total - montoAbonado).clamp(0, double.infinity);
}

class ProductLineInput {
  final int productoId;
  final String nombre;
  final int cantidad;
  final double precio;

  ProductLineInput({
    required this.productoId,
    required this.nombre,
    required this.cantidad,
    required this.precio,
  });

  double get subtotal => precio * cantidad;

  Map<String, dynamic> toApiJson() => {
    'productoId': productoId,
    'cantidad': cantidad,
    'precio': precio,
    'precioUnitario': precio,
  };
}

class VentaItem {
  final int id;
  final int clienteId;
  final String clienteNombre;
  final double total;
  final String metodoPago;
  final String tipo;
  final String estado;
  final String fecha;

  VentaItem({
    required this.id,
    required this.clienteId,
    required this.clienteNombre,
    required this.total,
    required this.metodoPago,
    required this.tipo,
    required this.estado,
    required this.fecha,
  });
}

class AbonoItem {
  final int id;
  final int pedidoId;
  final int clienteId;
  final String clienteNombre;
  final double monto;
  final String estado;
  final String metodoPago;
  final String fecha;
  final double totalPedido;

  AbonoItem({
    required this.id,
    required this.pedidoId,
    required this.clienteId,
    required this.clienteNombre,
    required this.monto,
    required this.estado,
    required this.metodoPago,
    required this.fecha,
    this.totalPedido = 0,
  });
}

class PedidoItem {
  final int id;
  final int clienteId;
  final double total;
  final String estado;
  final String metodoPago;
  final String fechaEntrega;

  PedidoItem({
    required this.id,
    required this.clienteId,
    required this.total,
    required this.estado,
    required this.metodoPago,
    required this.fechaEntrega,
  });
}

class DomicilioItem {
  final int id;
  final int pedidoId;
  final int clienteId;
  final int repartidorId;
  final String repartidorNombre;
  final String direccion;
  final double total;
  final String estado;
  final String fecha;

  DomicilioItem({
    required this.id,
    required this.pedidoId,
    required this.clienteId,
    required this.repartidorId,
    required this.repartidorNombre,
    required this.direccion,
    required this.total,
    required this.estado,
    required this.fecha,
  });
}
