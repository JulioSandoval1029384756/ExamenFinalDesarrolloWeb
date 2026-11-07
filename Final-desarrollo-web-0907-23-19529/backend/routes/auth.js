const express = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }
  const usuario = await Usuario.findOne({ where: { email } });
  const ok = usuario && (await bcrypt.compare(password, usuario.passwordHash));
  if (!ok) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  req.session.userId = usuario.id;
  res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid');
    res.json({ ok: true });
  });
});

router.get('/me', requireAuth, async (req, res) => {
  const u = await Usuario.findByPk(req.session.userId);
  if (!u) return res.status(401).json({ error: 'Usuario no existe' });
  res.json({ id: u.id, nombre: u.nombre, email: u.email });
});

module.exports = router;
