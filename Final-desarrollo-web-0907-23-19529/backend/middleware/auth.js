// Si no hay sesión válida (nunca inició sesión o expiró) responde 401.
// El frontend escucha ese 401 y redirige al login.
module.exports = function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'No autenticado o sesión expirada' });
  }
  next();
};
