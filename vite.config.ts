import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Tambahkan konfigurasi ini untuk mengatasi masalah build
  optimizeDeps: {
    include: ['@yudiel/react-qr-scanner'],
  },
  build: {
    commonjsOptions: {
      include: /node_modules/,
    },
  },
}));
