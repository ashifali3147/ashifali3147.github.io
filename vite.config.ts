import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is injected by the deploy workflow:
//   repo "ashifali3147.github.io"  -> VITE_BASE=/
//   repo "portfolio"               -> VITE_BASE=/portfolio/
// Local dev/build defaults to "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
