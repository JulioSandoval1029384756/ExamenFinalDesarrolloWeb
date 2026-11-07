const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Sala } = require('./models');
const authRoutes = require('./routes/auth');
const reservasRoutes = require('./routes/reservas');

const PORT = process.env.PORT || 3000;
const SESSION_MINUTES = Number(process.env.SESSION_MINUTES || 30);

const app = express();
app.use(express.json());

app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'cambia-esto-en-produccion',
    resave: false,
    saveUninitialized: false,
    // rolling: true => cada petición renueva la cookie, por lo que expira
    // tras 30 min SIN ACTIVIDAD (no 30 min desde el login).
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: SESSION_MINUTES * 60 * 1000,
    },
  })
);

app.use('/api', authRoutes);
app.use('/api', reservasRoutes);

async function seed() {
  if ((await Usuario.count()) === 0) {
    await Usuario.create({
      nombre: 'Estudiante Demo',
      email: 'estudiante@umg.edu.gt',
      passwordHash: await bcrypt.hash('123456', 10),
    });
  }
  if ((await Sala.count()) === 0) {
    await Sala.bulkCreate([
      { nombre: 'Sala A', capacidad: 4 },
      { nombre: 'Sala B', capacidad: 8 },
      { nombre: 'Sala C', capacidad: 12 },
    ]);
  }
}

sequelize
  .sync()
  .then(seed)
  .then(() => app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
