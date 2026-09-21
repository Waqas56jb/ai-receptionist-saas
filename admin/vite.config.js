import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Built for its own host root (admin.example.com / the Vercel project domain).
  // To host it under a path instead, use `npm run build:subpath`, which sets
  // base=/admin/ — the router basename follows import.meta.env.BASE_URL.
  base: '/',
  server: {
    port: 5174,
    open: true,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
