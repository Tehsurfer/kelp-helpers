import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode, command }) => {
  // Only add proxy in dev mode
  let server = {};
  const nodeEnv = process.env.NODE_ENV || 'production';
  if (nodeEnv === 'development') {
    const env = loadEnv(mode, process.cwd());
    const API_URL = env.VITE_REACT_APP_KH_API_URL || 'http://localhost:5000';
    server = {
      port: 3000,
      proxy: {
        '/api/tiles': {
          target: `${API_URL}/get-tile-data`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/tiles/, ''),
        },
      },
    };
  }

  return {
    plugins: [react()],
    server,
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    }
  };
});
