import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode }) => {
  // Load env variables for the current mode
  const env = loadEnv(mode, process.cwd());

  const API_URL = env.VITE_REACT_APP_KH_API_URL || 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api/tiles': {
          target: `${API_URL}/get-tile-data`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/tiles/, ''),
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    }
  };
});
