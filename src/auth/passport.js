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

// Estrategia Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  // Aquí deberías buscar o crear el usuario en la base de datos
  // Por simplicidad, devolvemos el perfil de Google
  return done(null, profile);
}));

// Exportar para usar en la app principal
module.exports = passport;
