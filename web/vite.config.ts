import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// FiveM NUI (CEF) dosyaları file:// üzerinden yükler -> göreli yollar şart
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})