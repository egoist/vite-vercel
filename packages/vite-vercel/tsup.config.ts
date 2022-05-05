import { defineConfig } from "tsup"

export default defineConfig(() => {
  return {
    target: "node14",
    entry: ["./src/index.ts", "./src/server.ts", "./src/polyfills.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: true,
    shims: false,
    minify: true,
    sourcemap: true,
  }
})
