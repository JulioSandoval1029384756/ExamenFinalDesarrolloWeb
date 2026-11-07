import { useEffect, useState } from 'react';
import { api } from './api.js';

export default function Reservas({ user, onLogout }) {
  const [salas, setSalas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({ salaId: '', fecha: '', horaInicio: '', horaFin: '' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  async function cargar() {
    try {
      const [s, r] = await Promise.all([api('/salas'), api('/reservas')]);
      setSalas(s);
      setReservas(r);
    } catch {
      /* si fue 401, App ya redirige al login */
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function reservar(e) {
    e.preventDefault();
    setError('');
    setOk('');
    try {
      await api('/reservas', {
        method: 'POST',
        body: { ...form, salaId: Number(form.salaId) },
      });
      setOk('Reserva creada');
      cargar();
    } catch (err) {
      setError(err.message); // aquí aparece el mensaje del 409 (solapamiento)
    }
  }

  async function cancelar(id) {
    try {
      await api(`/reservas/${id}`, { method: 'DELETE' });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <p className="bar">
        Hola, <b>{user.nombre}</b> <button onClick={onLogout}>Cerrar sesión</button>
      </p>

      <section className="card">
        <h2>Salas</h2>
        <ul>
          {salas.map((s) => (
            <li key={s.id}>
              {s.nombre} — capacidad {s.capacidad}
            </li>
          ))}
        </ul>
      </section>

      <form className="card" onSubmit={reservar}>
        <h2>Nueva reserva</h2>
        <label>
          Sala
          <select name="salaId" value={form.salaId} onChange={cambiar} required>
            <option value="">Selecciona…</option>
            {salas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Fecha
          <input type="date" name="fecha" value={form.fecha} onChange={cambiar} required />
        </label>
        <label>
          Hora inicio
          <input type="time" name="horaInicio" value={form.horaInicio} onChange={cambiar} required />
        </label>
        <label>
          Hora fin
          <input type="time" name="horaFin" value={form.horaFin} onChange={cambiar} required />
        </label>
        {error && <p className="error">{error}</p>}
        {ok && <p className="okmsg">{ok}</p>}
        <button type="submit">Reservar</button>
      </form>

      <section className="card">
        <h2>Reservas</h2>
        {reservas.length === 0 ? (
          <p>No hay reservas.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sala</th>
                <th>Fecha</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Reservó</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id}>
                  <td>{r.Sala?.nombre}</td>
                  <td>{r.fecha}</td>
                  <td>{r.horaInicio}</td>
                  <td>{r.horaFin}</td>
                  <td>{r.Usuario?.nombre}</td>
                  <td>
                    {r.usuarioId === user.id && (
                      <button onClick={() => cancelar(r.id)}>Cancelar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
