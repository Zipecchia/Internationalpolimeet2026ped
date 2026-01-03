import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "node:path"

export default defineConfig({
  plugins: [react()],

  // IMPORTANTISSIMO per GitHub Pages su repo:
  base: "/Internationalpolimeet2026ped/",

  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },

  build: {
    outDir: "dist",
  },
})
