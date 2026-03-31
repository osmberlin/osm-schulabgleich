import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/osm-schul-abgleich/' : '/',
  plugins: [tailwindcss(), react()],
  server: { port: 5174 },
})
