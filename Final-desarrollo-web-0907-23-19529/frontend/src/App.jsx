import { useEffect, useState } from 'react';
import { api, UNAUTHORIZED_EVENT } from './api.js';
import Login from './Login.jsx';
import Reservas from './Reservas.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState('');

  // Al cargar, preguntamos si ya hay sesión activa (la cookie persiste).
  useEffect(() => {
    api('/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCargando(false));
  }, []);

  // Cualquier 401 => volver al login.
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setAviso('Tu sesión expiró. Inicia sesión de nuevo.');
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  async function logout() {
    await api('/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    setAviso('');
  }

  if (cargando) return <p className="center">Cargando…</p>;

  return (
    <main>
      <h1>Reserva de salas de la biblioteca</h1>
      {user ? (
        <Reservas user={user} onLogout={logout} />
      ) : (
        <Login
          aviso={aviso}
          onLogin={(u) => {
            setUser(u);
            setAviso('');
          }}
        />
      )}
    </main>
  );
}
