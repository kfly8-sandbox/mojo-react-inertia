import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ルートページ
      '^/$': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req) => {
          if (!req.headers['x-inertia']) {
            return '/index.html'
          }
        }
      },
      // Hello page
      '/hello': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req) => {
          if (!req.headers['x-inertia']) {
            return '/index.html'
          }
        }
      },
      // Todo routes
      '^/todos$': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req) => {
          if (!req.headers['x-inertia'] && req.method === 'GET') {
            return '/index.html'
          }
        }
      },
      '^/todos/\\d+$': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req) => {
          if (!req.headers['x-inertia'] && req.method === 'GET') {
            return '/index.html'
          }
        }
      },
      // Users page (example)
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req) => {
          if (!req.headers['x-inertia']) {
            return '/index.html'
          }
        }
      }
    }
  },
  // SPAのフォールバック設定
  appType: 'spa'
})
