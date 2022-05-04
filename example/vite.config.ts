import { defineConfig } from "vite"
import vercel from "vite-vercel"

export default defineConfig({
  plugins: [
    vercel({
      middleware: "./middleware.ts",
    }),
  ],
})
