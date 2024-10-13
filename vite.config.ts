import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import tsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
// https://vitejs.dev/guide/static-deploy.html#github-pages 
export default defineConfig({
  base: "/anu/",
  mode: "production",
  plugins: [react(), tsConfigPaths()],
  server: {
    port: 4000,
  },
});
