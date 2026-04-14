const nodemailer = require('nodemailer');
const config = require('../../config');

let cachedTransporter = null;

const createTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const hasSmtpConfig = Boolean(config.mail.host && config.mail.user && config.mail.password);

  if (hasSmtpConfig) {
    cachedTransporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.secure,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    });
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    jsonTransport: true,
  });
  return cachedTransporter;
};

const sendTemporaryPasswordEmail = async ({ to, name, username, tempPassword }) => {
  const transporter = createTransporter();

  const message = {
    from: config.mail.from,
    to,
    subject: 'Acceso temporal a Grandma\'s Liquors',
    text: [
      `Hola ${name || ''}`.trim(),
      '',
      `Tu usuario temporal es: ${username}`,
      `Tu contraseña temporal es: ${tempPassword}`,
      '',
      'Debes cambiar la contraseña al ingresar por primera vez.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 16px;">Acceso temporal a Grandma's Liquors</h2>
        <p>Hola ${name || ''}</p>
        <p>Tu usuario temporal es: <strong>${username}</strong></p>
        <p>Tu contraseña temporal es: <strong>${tempPassword}</strong></p>
        <p>Debes cambiar la contraseña al ingresar por primera vez.</p>
      </div>
    `,
  };

  return transporter.sendMail(message);
};

const sendEmailChangeNotification = async ({ to, name, username, previousEmail, currentEmail }) => {
  const transporter = createTransporter();

  const message = {
    from: config.mail.from,
    to,
    subject: 'Tu correo de acceso fue actualizado',
    text: [
      `Hola ${name || ''}`.trim(),
      '',
      'Te informamos que el correo asociado a tu cuenta fue actualizado.',
      `Correo anterior: ${previousEmail || 'No disponible'}`,
      `Correo actual: ${currentEmail || to}`,
      `Usuario: ${username || 'No disponible'}`,
      '',
      'Si no realizaste este cambio, contacta al administrador de inmediato.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 16px;">Tu correo de acceso fue actualizado</h2>
        <p>Hola ${name || ''}</p>
        <p>Te informamos que el correo asociado a tu cuenta fue actualizado.</p>
        <ul>
          <li><strong>Correo anterior:</strong> ${previousEmail || 'No disponible'}</li>
          <li><strong>Correo actual:</strong> ${currentEmail || to}</li>
          <li><strong>Usuario:</strong> ${username || 'No disponible'}</li>
        </ul>
        <p>Si no realizaste este cambio, contacta al administrador de inmediato.</p>
      </div>
    `,
  };

  return transporter.sendMail(message);
};

const sendUserStatusChangeNotification = async ({ to, name, username, estado, motivo, changedBy }) => {
  const transporter = createTransporter();

  const message = {
    from: config.mail.from,
    to,
    subject: 'Cambio de estado de tu cuenta',
    text: [
      `Hola ${name || ''}`.trim(),
      '',
      `El estado de tu cuenta fue actualizado a: ${estado}`,
      `Usuario: ${username || 'No disponible'}`,
      changedBy ? `Realizado por: ${changedBy}` : null,
      motivo ? `Motivo: ${motivo}` : null,
      '',
      'Si no reconoces este cambio, contacta inmediatamente al administrador.',
    ]
      .filter(Boolean)
      .join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 16px;">Cambio de estado de tu cuenta</h2>
        <p>Hola ${name || ''}</p>
        <p>El estado de tu cuenta fue actualizado a: <strong>${estado}</strong></p>
        <ul>
          <li><strong>Usuario:</strong> ${username || 'No disponible'}</li>
          ${changedBy ? `<li><strong>Realizado por:</strong> ${changedBy}</li>` : ''}
          ${motivo ? `<li><strong>Motivo:</strong> ${motivo}</li>` : ''}
        </ul>
        <p>Si no reconoces este cambio, contacta inmediatamente al administrador.</p>
      </div>
    `,
  };

  return transporter.sendMail(message);
};

module.exports = {
  sendTemporaryPasswordEmail,
  sendEmailChangeNotification,
  sendUserStatusChangeNotification,
};
