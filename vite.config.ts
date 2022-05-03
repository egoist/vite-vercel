import { defineConfig } from "vite"
import vercel from "./src"

export default defineConfig({
  plugins: [
    vercel({
      middleware: "./middleware.ts",
    }),
  ],
  build: {
    outDir: "./example-dist",
  },
})
