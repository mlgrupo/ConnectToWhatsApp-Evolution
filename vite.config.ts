import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 91,
    host: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.REACT_APP_EVOLUTION_API_KEY': JSON.stringify(process.env.REACT_APP_EVOLUTION_API_KEY),
    'process.env.REACT_APP_EVOLUTION_BASE_URL': JSON.stringify(process.env.REACT_APP_EVOLUTION_BASE_URL)
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
    // ✅ Sem rollupOptions.input
  },
})
