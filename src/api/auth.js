const express = require('express');
const passport = require('../auth/passport');
const router = express.Router();

// Ruta para iniciar login con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

const { generateAccessToken, generateRefreshToken } = require('../auth/jwt');

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
