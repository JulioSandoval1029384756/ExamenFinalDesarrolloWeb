import { useState } from 'react';
import { api } from './api.js';

export default function Login({ onLogin, aviso }) {
  const [email, setEmail] = useState('estudiante@umg.edu.gt');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function enviar(e) {
    e.preventDefault();
    setError('');
    try {
      const u = await api('/login', { method: 'POST', body: { email, password } });
      onLogin(u);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={enviar}>
      <h2>Iniciar sesión</h2>
      {aviso && <p className="warn">{aviso}</p>}
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </label>
      <label>
        Contraseña
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
}
