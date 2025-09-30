const express = require('express');
const passport = require('../auth/passport');
const router = express.Router();

// Ruta para iniciar login con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../auth/jwt');
// Simulación de usuarios en memoria
const users = [];

// Validación simple
function validateUser(data) {
  if (!data.email || typeof data.email !== 'string') return false;
  if (!data.password || typeof data.password !== 'string') return false;
  return true;
}

// Registro
router.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  if (!validateUser(req.body)) {
    return res.status(400).json({ success: false, error: 'Datos inválidos' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ success: false, error: 'Usuario ya existe' });
  }
  const user = { id: users.length + 1, email, password, role: role || 'user' };
  users.push(user);
  res.status(201).json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!validateUser(req.body)) {
    return res.status(400).json({ success: false, error: 'Datos inválidos' });
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({ success: true, accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } });
});

// Refresh token
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, error: 'Refresh token requerido' });
  }
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = users.find(u => u.id === payload.id);
    if (!user) throw new Error('Usuario no encontrado');
    const accessToken = generateAccessToken(user);
    res.json({ success: true, accessToken });
  } catch (err) {
    res.status(401).json({ success: false, error: 'Refresh token inválido' });
  }
});

// Callback de Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Generar access y refresh tokens
  const user = {
    id: req.user.id || req.user.sub || req.user.email,
    email: req.user.emails ? req.user.emails[0].value : undefined
  };
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({
    success: true,
    user,
    accessToken,
    refreshToken
  });
});

module.exports = router;
