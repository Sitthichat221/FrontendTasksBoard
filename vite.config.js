// vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/tasks': 'http://localhost:8080', // Spring Boot API
      '/auth': 'http://localhost:8080',  // Spring Boot API
    },
  },
});
