import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/battle-app/', // GitHub Pages - must match repo name!
  plugins: [react()],
});