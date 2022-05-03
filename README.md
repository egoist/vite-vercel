**💛 You can help the author become a full-time open-source maintainer by [sponsoring him on GitHub](https://github.com/sponsors/egoist).**

---

# vite-vercel

[![npm version](https://badgen.net/npm/v/vite-vercel)](https://npm.im/vite-vercel) [![npm downloads](https://badgen.net/npm/dm/vite-vercel)](https://npm.im/vite-vercel)

> Adding a middleware powered by [Vercel Edge Function](https://vercel.com/features/edge-functions) to your existing Vite project.

## Install

```bash
npm i vite-vercel -D
```

## Usage

In your `vite.config.ts`:

```ts
import { defineConfig } from "vite"
import vercel from "vite-vercel"

export default defineConfig({
  plugins: [
    vercel({
      middleware: "./middleware.ts",
    }),
  ],
})
```

Creating a `middleware.ts`:

```ts
import { MiddlewareRequest, MiddlewareResponse } from "vite-vercel/server"

export default (req: MiddlewareRequest) => {
  const url = new URL(req.url)

  if (url.pathname === "/from-middleware") {
    return new Response("from middleware")
  }

  // Rewrite to another URL
  if (url.pathname === "/todo") {
    return MiddlewareResponse.rewrite(
      "https://jsonplaceholder.typicode.com/todos/1",
    )
  }

  // Continue serving `index.html`
  return MiddlewareResponse.next()
}
```

## Deploy on Vercel

This plugin uses Vercel's [Build Output API (v3)](https://vercel.com/docs/build-output-api/v3) which requires an Environment Variable named `ENABLE_VC_BUILD` to be set to `1` in order to enable the feature.

## Sponsors

[![sponsors](https://sponsors-images.egoist.sh/sponsors.svg)](https://github.com/sponsors/egoist)

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
