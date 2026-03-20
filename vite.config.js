import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/generate': {
        target: 'https://ai.hackclub.com',
        changeOrigin: true,
        rewrite: () => '/proxy/v1/chat/completions',
      },
    },
  },
})