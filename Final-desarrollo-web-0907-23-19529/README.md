# Reserva de salas de biblioteca

Node.js + Express + Sequelize (SQLite) en el backend, React (Vite) en el frontend, sesión con cookies.

## Cómo correrlo
```bash
# Terminal 1 - backend (http://localhost:3000)
cd backend
npm install
npm start

# Terminal 2 - frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```
Abrir http://localhost:5173. Usuario de prueba: `estudiante@umg.edu.gt` / `123456`
(se crea solo la primera vez junto con 3 salas).

Para probar la expiración rápido: `SESSION_MINUTES=0.5 npm start` (30 segundos).
