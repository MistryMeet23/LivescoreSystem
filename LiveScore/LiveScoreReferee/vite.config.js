import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        '/api': {
            target: 'http://localhost:5032',
            changeOrigin: true,
            secure: false,
            ws: true,
        },
        '/ACR': {  // Proxy for images
          target: 'http://localhost:5032',
          changeOrigin: true,
          secure: false,
        },
        '/images': {  // Proxy for images
          target: 'http://localhost:5032',
          changeOrigin: true,
          secure: false,
        },
        '/scoreHub': {  // Proxy for SignalR hub
          target: 'http://localhost:5032',
          changeOrigin: true,
          secure: false,
          ws: true,  // Enable WebSocket support
        }
    },
    port: 5173,
}
})
