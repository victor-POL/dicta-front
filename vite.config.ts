import path from "path";
import { analyzer } from 'vite-bundle-analyzer'

import tailwindcss from "@tailwindcss/vite"

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
      alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Para que Vite bind a todas las interfaces en Docker
    port: 5173,
    allowedHosts: [
      'dicta.ar',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ],
    watch: {
      usePolling: true, // Necesario para que funcione con volúmenes Docker
    },
    proxy: {
      '/api': {
        target: 'http://backend:3001', // Usar el nombre del servicio Docker
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
