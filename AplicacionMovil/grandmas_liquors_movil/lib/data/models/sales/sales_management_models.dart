class SalesOption {
  final int id;
  final String label;

  SalesOption({required this.id, required this.label});
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
