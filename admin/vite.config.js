import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The admin portal is served under /admin/ in production.
  base: '/admin/',
  server: {
    port: 5174,
    open: true,
  },
})
