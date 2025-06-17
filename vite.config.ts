import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
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
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
})
