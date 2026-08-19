import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set via BASE_PATH=/eventop_erp_frontend/ for GitHub Pages (see npm run build:pages)
  base: process.env.BASE_PATH ?? '/',
})
