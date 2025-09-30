const { verifyAccessToken } = require('./jwt');

// Middleware para verificar JWT y rol
function authorize(roles = []) {
  // roles puede ser string o array
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Token requerido' });
    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      // Si no se requiere rol específico, permitir
      if (!roles.length || (payload.role && roles.includes(payload.role))) {
        return next();
      }
      return res.status(403).json({ success: false, error: 'No autorizado' });
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Token inválido' });
    }
  };
}

module.exports = { authorize };
