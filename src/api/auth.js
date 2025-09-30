const express = require('express');
const passport = require('../auth/passport');
const router = express.Router();

// Ruta para iniciar login con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback de Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Aquí puedes generar un JWT o establecer sesión
  res.json({ success: true, user: req.user });
});

module.exports = router;
