import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El proxy hace que el navegador vea frontend y API en el MISMO origen
// (localhost:5173), así la cookie de sesión viaja sin problemas de CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3000' },
  },
});
