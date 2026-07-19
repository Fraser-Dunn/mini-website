import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/mini-website/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  // amazon-cognito-identity-js assumes Node's `global` exists, which
  // isn't polyfilled by Vite/esbuild the way CRA/webpack used to.
  define: {
    global: "globalThis",
  },
});
