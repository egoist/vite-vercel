import path from "path"
import { type Plugin } from "vite"
import { createRequest } from "./server-node"
import * as esbuild from "esbuild"
import fs from "fs-extra"

export type Options = {
  middleware?: string
}

const writeJson = (filepath: string, data: any) => {
  fs.mkdirSync(path.dirname(filepath), { recursive: true })
  fs.writeFileSync(filepath, JSON.stringify(data))
}

export const plugin = (options: Options = {}): Plugin => {
  let middlewarePath: string | undefined
  return {
    name: "vercel",

    // @ts-expect-error
    config() {
      return {
        ssr: {
          // Not sure why Vite SSR can't handle these
          // It throws something like
          // ReferenceError: require is not defined
          // at /node_modules/.pnpm/fetch-blob@3.1.5/node_modules/fetch-blob/streams.cjs:16:17
          external: ["node-fetch", "@web-std/file"],
        },
      }
    },

    configResolved(config) {
      middlewarePath =
        options.middleware && path.resolve(config.root, options.middleware)
    },

    configureServer(server) {
      if (!middlewarePath) return

      server.middlewares.use(async (req, res, next) => {
        await server.ssrLoadModule(path.join(__dirname, "server-prepare"))

        const middleware = await server.ssrLoadModule(`/@fs${middlewarePath}`)
        const request = createRequest(req)
        const response: Response = await middleware.default(request)

        if (response.headers.get("x-middleware-next") === "1") {
          return next()
        }

        const ab = await response.arrayBuffer()
        res.end(Buffer.from(ab))
      })
    },

    async writeBundle({ dir }) {
      // Copy static file
      await fs.copy(dir || "dist", ".vercel/output/static")

      if (middlewarePath) {
        await esbuild.build({
          entryPoints: [middlewarePath],
          bundle: true,
          platform: "node",
          target: "node14",
          outfile: `.vercel/output/functions/main.func/index.js`,
          format: "esm",
        })

        writeJson(".vercel/output/functions/main.func/.vc-config.json", {
          runtime: "edge",
          entrypoint: "index.js",
        })
      }

      writeJson(".vercel/output/config.json", {
        version: 3,
        routes: [
          {
            src: `/assets/.+`,
            headers: {
              "cache-control": "public, immutable, max-age=31536000",
            },
          },
          {
            handle: "filesystem",
          },
          middlewarePath && {
            src: "/.*",
            middlewarePath: "main",
            continue: true,
          },
          { src: "/.*", dest: "/index.html" },
        ].filter(Boolean),
      })
    },
  }
}
