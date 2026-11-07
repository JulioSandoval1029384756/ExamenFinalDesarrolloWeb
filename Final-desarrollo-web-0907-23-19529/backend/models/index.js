const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_FILE || './reservas.sqlite',
  logging: false,
});

const Usuario = sequelize.define('Usuario', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
});

const Sala = sequelize.define('Sala', {
  nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
  capacidad: { type: DataTypes.INTEGER, allowNull: false },
});

// fecha: 'YYYY-MM-DD'. horaInicio / horaFin: 'HH:MM' (con cero a la izquierda,
// así la comparación de strings equivale a comparar horas).
const Reserva = sequelize.define('Reserva', {
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  horaInicio: { type: DataTypes.STRING(5), allowNull: false },
  horaFin: { type: DataTypes.STRING(5), allowNull: false },
});

Usuario.hasMany(Reserva, { foreignKey: 'usuarioId' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Sala.hasMany(Reserva, { foreignKey: 'salaId' });
Reserva.belongsTo(Sala, { foreignKey: 'salaId' });

module.exports = { sequelize, Usuario, Sala, Reserva };
