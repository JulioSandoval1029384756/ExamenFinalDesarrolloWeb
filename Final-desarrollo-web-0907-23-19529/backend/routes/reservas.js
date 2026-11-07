const express = require('express');
const { Op } = require('sequelize');
const { Sala, Reserva, Usuario } = require('../models');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const RE_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const RE_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

router.get('/salas', async (req, res) => {
  res.json(await Sala.findAll({ order: [['nombre', 'ASC']] }));
});

router.get('/reservas', async (req, res) => {
  const reservas = await Reserva.findAll({
    include: [
      { model: Sala, attributes: ['id', 'nombre'] },
      { model: Usuario, attributes: ['id', 'nombre'] },
    ],
    order: [['fecha', 'ASC'], ['horaInicio', 'ASC']],
  });
  res.json(reservas);
});

router.post('/reservas', async (req, res) => {
  const { salaId, fecha, horaInicio, horaFin } = req.body || {};

  if (!salaId || !fecha || !horaInicio || !horaFin) {
    return res.status(400).json({ error: 'Faltan datos (sala, fecha, hora inicio, hora fin)' });
  }
  if (!RE_FECHA.test(fecha) || !RE_HORA.test(horaInicio) || !RE_HORA.test(horaFin)) {
    return res.status(400).json({ error: 'Formato inválido (fecha YYYY-MM-DD, hora HH:MM)' });
  }
  if (horaInicio >= horaFin) {
    return res.status(400).json({ error: 'La hora de inicio debe ser menor que la hora de fin' });
  }

  const sala = await Sala.findByPk(salaId);
  if (!sala) return res.status(404).json({ error: 'La sala no existe' });

  // REGLA DE NEGOCIO: dos rangos [a,b) y [c,d) se solapan si a < d  Y  c < b.
  // Usamos desigualdades estrictas: una reserva 10:00-11:00 y otra 11:00-12:00
  // NO se solapan (la segunda empieza justo cuando termina la primera).
  const conflicto = await Reserva.findOne({
    where: {
      salaId,
      fecha,
      horaInicio: { [Op.lt]: horaFin },
      horaFin: { [Op.gt]: horaInicio },
    },
  });
  if (conflicto) {
    return res.status(409).json({
      error: `La sala ya está reservada de ${conflicto.horaInicio} a ${conflicto.horaFin} ese día`,
    });
  }

  const reserva = await Reserva.create({
    salaId,
    fecha,
    horaInicio,
    horaFin,
    usuarioId: req.session.userId,
  });
  res.status(201).json(reserva);
});

router.delete('/reservas/:id', async (req, res) => {
  const reserva = await Reserva.findByPk(req.params.id);
  if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });
  if (reserva.usuarioId !== req.session.userId) {
    return res.status(403).json({ error: 'Solo puedes cancelar tus propias reservas' });
  }
  await reserva.destroy();
  res.json({ ok: true });
});

module.exports = router;
