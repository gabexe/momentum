const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';

// Generar access token
function generateAccessToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
}

// Generar refresh token
function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

// Verificar access token
function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Verificar refresh token
function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
