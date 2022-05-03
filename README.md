**💛 You can help the author become a full-time open-source maintainer by [sponsoring him on GitHub](https://github.com/sponsors/egoist).**

---

# vite-vercel

[![npm version](https://badgen.net/npm/v/vite-vercel)](https://npm.im/vite-vercel) [![npm downloads](https://badgen.net/npm/dm/vite-vercel)](https://npm.im/vite-vercel)

## Install

```bash
npm i vite-vercel
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
import { MiddlewareResponse } from "vite-vercel/server"

export default (req: Request) => {
  const url = new URL(req.url)

  if (url.pathname === "/from-middleware") {
    return new Response("from middleware")
  }

  // Continue serving `index.html`
  return MiddlewareResponse.next()
}
```

## Sponsors

[![sponsors](https://sponsors-images.egoist.sh/sponsors.svg)](https://github.com/sponsors/egoist)

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
