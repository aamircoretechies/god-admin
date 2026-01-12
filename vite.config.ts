import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_APP_API_URL || 'http://127.0.0.1:3000';
  
 
  // console.log('\n📡 API Proxy Configuration:');
  // console.log(`   Target: ${apiUrl}`);
  // console.log(`   Proxy: /api/* → ${apiUrl}/api/*\n`);
  
  return {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss()]
      }
    },
    base: '/god-admin',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      chunkSizeWarningLimit: 3000
    },
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: apiUrl.startsWith('https'),
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          configure: (proxy, _options) => {
            proxy.on('error', (err, req, res) => {
              console.error('\n Proxy Error:', err.code);
              if (err.code === 'ECONNREFUSED') {
                // console.error(`   Cannot connect to backend API at ${apiUrl}`);
                // console.error('   Make sure your backend server is running on port 3000\n');
              }
              if (!res.headersSent) {
                res.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
                res.end('Proxy error: Backend server not available. Make sure your API server is running on port 3000.');
              }
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log(`→ ${req.method} ${req.url} → ${apiUrl}${req.url}`);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log(`← ${proxyRes.statusCode} ${req.url}`);
            });
          }
        }
      }
    }
  };
});


