const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configuración base de Passport.js
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Aquí deberías buscar el usuario en la base de datos
  done(null, { id });
});

// Exportar para usar en la app principal
module.exports = passport;
