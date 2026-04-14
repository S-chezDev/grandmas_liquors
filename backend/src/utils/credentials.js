const crypto = require('crypto');

const normalizeUsernameBase = (email) => {
  const localPart = String(email || '')
    .trim()
    .toLowerCase()
    .split('@')[0]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]/g, '');

  return localPart || 'usuario';
};

const generateTempPassword = (length = 12) => {
  const minLength = Math.max(12, length);
  const charset = {
    upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    lower: 'abcdefghijkmnopqrstuvwxyz',
    number: '23456789',
    special: '!@#$%^&*()-_=+[]{};:,.?'
  };

  const pick = (pool) => pool[crypto.randomInt(0, pool.length)];
  const required = [
    pick(charset.upper),
    pick(charset.lower),
    pick(charset.number),
    pick(charset.special),
  ];

  const remainingLength = Math.max(minLength - required.length, 0);
  const fullPool = Object.values(charset).join('');
  const remaining = Array.from({ length: remainingLength }, () => pick(fullPool));
  const passwordChars = [...required, ...remaining];

  for (let index = passwordChars.length - 1; index > 0; index -= 1) {
    const swapIndex = crypto.randomInt(0, index + 1);
    [passwordChars[index], passwordChars[swapIndex]] = [passwordChars[swapIndex], passwordChars[index]];
  }

  return passwordChars.join('');
};

const isStrongPassword = (password) => {
  if (typeof password !== 'string') return false;

  const value = password.trim();
  if (value.length < 8) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  if (!/[!@#$%^&*()\-_=+\[\]{};:,.?]/.test(value)) return false;

  return true;
};

const buildUsernameFromEmail = async (queryRunner, email, excludeUserId = null) => {
  const base = normalizeUsernameBase(email);
  let candidate = base;
  let counter = 1;

  while (true) {
    const params = [candidate];
    let sql = 'SELECT id FROM usuarios WHERE LOWER(username) = LOWER($1)';
    if (excludeUserId) {
      sql += ' AND id <> $2';
      params.push(excludeUserId);
    }

    const result = await queryRunner.query(sql, params);
    if (result.rows.length === 0) {
      return candidate;
    }

    candidate = `${base}${counter}`;
    counter += 1;
  }
};

module.exports = {
  normalizeUsernameBase,
  generateTempPassword,
  buildUsernameFromEmail,
  isStrongPassword,
};
