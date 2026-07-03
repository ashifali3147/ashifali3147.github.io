import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// Base path is injected by the deploy workflow:
//   repo "ashifali3147.github.io"  -> VITE_BASE=/
//   repo "portfolio"               -> VITE_BASE=/portfolio/
// Local dev/build defaults to "/".
// `npm run dev:https` sets HTTPS=1 — self-signed cert so phones on the LAN
// get a secure context (required for the gyroscope tilt on the world map).
export default defineConfig({
  plugins: [react(), ...(process.env.HTTPS ? [basicSsl()] : [])],
  base: process.env.VITE_BASE || '/',
})
