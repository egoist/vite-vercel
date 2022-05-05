import path from "path"
import { type Plugin, build } from "vite"
import fs from "fs-extra"
import { nodeFileTrace } from "@vercel/nft"

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
      if (!middlewarePath || process.env.VITE_VERCEL_BUILD) return

      let serverNode: typeof import("vercel-utils/server-node") | undefined

      server.middlewares.use(async (req, res, next) => {
        if (serverNode) return next()

        await server.ssrLoadModule(`/@id/vite-vercel/server-prepare`)
        serverNode = (await server.ssrLoadModule(
          `/@id/vite-vercel/server-node`,
        )) as any
        next()
      })

      server.middlewares.use(async (req, res, next) => {
        if (!serverNode) return next()

        try {
          const middleware = await server.ssrLoadModule(`/@fs${middlewarePath}`)
          const request = serverNode.createRequest(req)
          let response: Response = await middleware.default(request)

          if (response.headers.get("x-middleware-next") === "1") {
            return next()
          }

          const rewriteTo = response.headers.get("x-middleware-rewrite")
          if (rewriteTo) {
            response = await fetch(rewriteTo)
          }

          response.headers.forEach((value, key) => {
            if (key !== "content-encoding" && value !== undefined) {
              res.setHeader(key, value)
            }
          })

          const ab = await response.arrayBuffer()
          res.end(Buffer.from(ab))
        } catch (error) {
          if (error instanceof Error) {
            server.ssrFixStacktrace(error)
          }
          next(error)
        }
      })
    },

    async writeBundle({ dir }) {
      if (process.env.VITE_VERCEL_BUILD) return

      process.env.VITE_VERCEL_BUILD = "1"

      // Copy static file
      await fs.copy(dir || "dist", ".vercel/output/static")

      if (middlewarePath) {
        await build({
          publicDir: false,
          build: {
            ssr: true,
            polyfillDynamicImport: false,
            rollupOptions: {
              input: {
                index: middlewarePath,
              },
              output: {
                format: "esm",
              },
              preserveEntrySignatures: "strict",
            },
            outDir: `.vercel/output/functions/main.func`,
          },
        })

        const { fileList } = await nodeFileTrace([
          `.vercel/output/functions/main.func/index.js`,
        ])

        for (const filename of fileList) {
          if (filename.includes("node_modules")) {
            await fs.copy(
              filename,
              `.vercel/output/functions/main.func/${filename}`,
            )
          }
        }

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
