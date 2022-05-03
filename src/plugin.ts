import path from "path"
import { type Plugin } from "vite"
import { Request, Response, Headers } from "undici"
import { createRequest } from "./server"
import * as esbuild from "esbuild"
import fs from "fs"

export type Options = {
  middleware?: string
}

globalThis.Request = globalThis.Request || Request
globalThis.Response = globalThis.Response || Response
globalThis.Headers = globalThis.Headers || Headers

const writeJson = (filepath: string, data: any) => {
  fs.mkdirSync(path.dirname(filepath), { recursive: true })
  fs.writeFileSync(filepath, JSON.stringify(data))
}

export const plugin = (options: Options = {}): Plugin => {
  let middlewarePath: string | undefined
  return {
    name: "vercel",

    configResolved(config) {
      middlewarePath =
        options.middleware && path.resolve(config.root, options.middleware)
    },

    configureServer(server) {
      if (!middlewarePath) return

      server.middlewares.use(async (req, res) => {
        const middleware = await server.ssrLoadModule(`/@fs${middlewarePath}`)
        const request = createRequest(req)
        const response: Response = await middleware.default(request)
        const ab = await response.arrayBuffer()
        res.end(Buffer.from(ab))
      })
    },

    async buildEnd() {
      if (!middlewarePath) {
        return
      }

      await esbuild.build({
        entryPoints: [middlewarePath],
        bundle: true,
        platform: "neutral",
        outfile: `.vercel/output/functions/main.func/index.js`,
        format: "esm",
      })

      writeJson(".vercel/output/functions/main.func/.vc-config.json", {
        runtime: "edge",
        entrypoint: "index.js",
      })

      writeJson(".vercel/output/config.json", {
        routes: [
          {
            src: "/(.*)",
            middlewarePath: "main",
            continue: true,
          },
        ],
      })
    },
  }
}
