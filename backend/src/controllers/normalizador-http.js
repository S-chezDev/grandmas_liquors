const TIPO_DOCUMENTO_MAP = {
  cc: 'CC',
  ce: 'CE',
  ti: 'TI',
  pp: 'Pasaporte',
  pasaporte: 'Pasaporte',
};

const VENTA_ESTADO_MAP = {
  pendiente: 'Pendiente',
  completada: 'Completada',
  completado: 'Completada',
  cancelada: 'Cancelada',
  cancelado: 'Cancelada',
  anulada: 'Cancelada',
  anulado: 'Cancelada',
};

const ABONO_ESTADO_MAP = {
  registrado: 'Registrado',
  activo: 'Registrado',
  cancelado: 'Cancelado',
  cancelada: 'Cancelado',
  anulado: 'Cancelado',
  anulada: 'Cancelado',
};

const BASE_ESTADO_MAP = {
  activo: 'Activo',
  activa: 'Activo',
  inactivo: 'Inactivo',
  inactiva: 'Inactivo',
};

const TIPO_PERSONA_MAP = {
  natural: 'Natural',
  juridica: 'Juridica',
  'jurídica': 'Juridica',
};

const parseBooleanValue = (value) => {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  return false;
};

const parseNumberValue = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const METODO_PAGO_MAP = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  'transferencia bancaria': 'Transferencia',
  contraentrega: 'Contraentrega',
  'contra entrega': 'Contraentrega',
  nequi: 'Nequi',
  daviplata: 'Daviplata',
};

const canonicalizeWithMap = (value, map) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return null;
  const key = value.trim().toLowerCase();
  if (!key) return null;
  return map[key] || null;
};

const normalizeTipoDocumento = (value) => canonicalizeWithMap(value, TIPO_DOCUMENTO_MAP);

const normalizeMetodoPago = (value) => canonicalizeWithMap(value, METODO_PAGO_MAP);

const normalizeVentaPayload = (payload = {}) => {
  const data = { ...payload };

  if (payload.estado !== undefined) {
    const estado = canonicalizeWithMap(payload.estado, VENTA_ESTADO_MAP);
    if (!estado) {
      return {
        error: 'Estado de venta invalido. Valores permitidos: Pendiente, Completada, Cancelada.',
      };
    }
    data.estado = estado;
  }

  const rawMetodoPago = payload.metodopago ?? payload.metodoPago ?? payload.metodo_pago;
  if (rawMetodoPago !== undefined) {
    const metodoPago = normalizeMetodoPago(rawMetodoPago);
    if (!metodoPago) {
      return {
        error: 'Metodo de pago invalido. Valores permitidos: Efectivo, Tarjeta, Transferencia, Contraentrega, Nequi, Daviplata.',
      };
    }
    data.metodopago = metodoPago;
  }

  return { data };
};

const normalizeAbonoPayload = (payload = {}) => {
  const data = { ...payload };

  if (payload.estado !== undefined) {
    const estado = canonicalizeWithMap(payload.estado, ABONO_ESTADO_MAP);
    if (!estado) {
      return {
        error: 'Estado de abono invalido. Valores permitidos: Registrado, Cancelado.',
      };
    }
    data.estado = estado;
  }

  const rawMetodoPago = payload.metodo_pago ?? payload.metodoPago ?? payload.metodopago;
  if (rawMetodoPago !== undefined) {
    const metodoPago = normalizeMetodoPago(rawMetodoPago);
    if (!metodoPago) {
      return {
        error: 'Metodo de pago invalido. Valores permitidos: Efectivo, Tarjeta, Transferencia, Contraentrega, Nequi, Daviplata.',
      };
    }
    data.metodo_pago = metodoPago;
  }

  return { data };
};

const normalizeClientePayload = (payload = {}) => {
  const data = { ...payload };
  const rawTipoDocumento = payload.tipoDocumento ?? payload.tipo_documento;

  if (rawTipoDocumento !== undefined) {
    const tipoDocumento = normalizeTipoDocumento(rawTipoDocumento);
    if (!tipoDocumento) {
      return {
        error: 'Tipo de documento invalido. Valores permitidos: CC, CE, TI, Pasaporte.',
      };
    }
    data.tipoDocumento = tipoDocumento;
  }

  return { data };
};

const normalizeAuthRegisterPayload = (payload = {}) => {
  const data = { ...payload };
  const tipoDocumento = normalizeTipoDocumento(payload.tipoDocumento ?? 'CC');

  if (!tipoDocumento) {
    return {
      error: 'Tipo de documento invalido. Valores permitidos: CC, CE, TI, Pasaporte.',
    };
  }

  data.tipoDocumento = tipoDocumento;
  return { data };
};

const normalizeUsuarioPayload = (payload = {}) => {
  const data = { ...payload };

  const rawTipoDocumento = payload.tipo_documento ?? payload.tipoDocumento;
  if (rawTipoDocumento !== undefined) {
    const tipoDocumento = normalizeTipoDocumento(rawTipoDocumento);
    if (!tipoDocumento) {
      return {
        error: 'Tipo de documento invalido. Valores permitidos: CC, CE, TI, Pasaporte.',
      };
    }
    data.tipo_documento = tipoDocumento;
  }

  if (payload.estado !== undefined) {
    const estado = canonicalizeWithMap(payload.estado, BASE_ESTADO_MAP);
    if (!estado) {
      return {
        error: 'Estado invalido. Valores permitidos: Activo, Inactivo.',
      };
    }
    data.estado = estado;
  }

  if (payload.telefono !== undefined) {
    const telefono = String(payload.telefono).replace(/\D/g, '');
    if (telefono.length < 7 || telefono.length > 15) {
      return {
        error: 'Telefono invalido. Debe tener entre 7 y 15 digitos numericos.',
      };
    }
    data.telefono = telefono;
  }

  return { data };
};

const normalizeProveedorPayload = (payload = {}) => {
  const data = { ...payload };

  const rawTipoDocumento = payload.tipoDocumento ?? payload.tipo_documento;
  if (rawTipoDocumento !== undefined) {
    const tipoDocumento = normalizeTipoDocumento(rawTipoDocumento);
    if (!tipoDocumento) {
      return {
        error: 'Tipo de documento invalido. Valores permitidos: CC, CE, TI, Pasaporte.',
      };
    }
    data.tipoDocumento = tipoDocumento;
  }

  const rawTipoPersona = payload.tipoPersona ?? payload.tipo_persona;
  if (rawTipoPersona !== undefined) {
    const tipoPersona = canonicalizeWithMap(rawTipoPersona, TIPO_PERSONA_MAP);
    if (!tipoPersona) {
      return {
        error: 'Tipo de persona invalido. Valores permitidos: Natural, Juridica.',
      };
    }
    data.tipoPersona = tipoPersona;
  }

  if (payload.estado !== undefined) {
    const estado = canonicalizeWithMap(payload.estado, BASE_ESTADO_MAP);
    if (!estado) {
      return {
        error: 'Estado invalido. Valores permitidos: Activo, Inactivo.',
      };
    }
    data.estado = estado;
  }

  if (payload.telefono !== undefined) {
    const telefono = String(payload.telefono).replace(/\D/g, '');
    if (telefono.length < 7 || telefono.length > 15) {
      return {
        error: 'Telefono invalido. Debe tener entre 7 y 15 digitos numericos.',
      };
    }
    data.telefono = telefono;
  }

  if (payload.preferente !== undefined) {
    data.preferente = parseBooleanValue(payload.preferente);
  }

  if (payload.rating !== undefined) {
    const rating = parseNumberValue(payload.rating);
    if (rating === null || rating < 0 || rating > 5) {
      return {
        error: 'Rating invalido. Debe ser un numero entre 0 y 5.',
      };
    }
    data.rating = rating;
  }

  if (payload.observaciones !== undefined) {
    data.observaciones = String(payload.observaciones).trim();
  }

  return { data };
};

module.exports = {
  normalizeTipoDocumento,
  normalizeVentaPayload,
  normalizeAbonoPayload,
  normalizeClientePayload,
  normalizeAuthRegisterPayload,
  normalizeUsuarioPayload,
  normalizeProveedorPayload,
};
