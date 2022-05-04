import { defineConfig } from "tsup"

export default defineConfig({
  target: "node14",
  entry: ["./src/index.ts", "./src/server.ts", "./src/server-prepare.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
})
