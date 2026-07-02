const { z } = require('zod');
const {
  motivoEstadoBody,
  humanNameString,
  documentoString,
  telefonoString,
  emailString,
  longTextString,
} = require('./common.schema');

const createClienteBodyBase = z
  .object({
    nombre: humanNameString,
    apellido: humanNameString,
    tipoDocumento: z.string().trim().optional(),
    tipo_documento: z.string().trim().optional(),
    documento: documentoString,
    telefono: telefonoString,
    email: emailString,
    direccion: longTextString,
    password: z.string().trim().optional(),
    estado: z.enum(['Activo', 'Inactivo']).optional(),
    foto_url: z.string().nullable().optional(),
  })
  .passthrough();

const createClienteBody = createClienteBodyBase
  .superRefine((data, ctx) => {
    const td = data.tipoDocumento || data.tipo_documento;
    if (!td || !td.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El tipo de documento es obligatorio',
        path: ['tipoDocumento'],
      });
    } else {
      data.tipoDocumento = td.trim();
    }
  });

const updateClienteBody = createClienteBodyBase.partial().passthrough();

const updateClienteEstadoBody = motivoEstadoBody;

module.exports = {
  createClienteBody,
  updateClienteBody,
  updateClienteEstadoBody,
};
