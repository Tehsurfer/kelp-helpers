import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode }) => {
  // Try to load env variables for the current mode
  let env;
  try {
    env = loadEnv(mode, process.cwd());
  } catch (e) {
    env = {};
  }

  // Prefer Vite env, fallback to process.env for Heroku/production
  const API_URL =
    env?.VITE_REACT_APP_KH_API_URL ||
    process.env.VITE_REACT_APP_KH_API_URL ||
    'https://kelp-helpers-api-5f809acc216a.herokuapp.com';

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
