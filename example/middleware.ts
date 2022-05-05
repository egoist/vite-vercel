import {
  MiddlewareRequest,
  MiddlewareResponse,
  MiddlewareFetchEvent,
} from "vite-vercel/server"

export default (req: MiddlewareRequest, event: MiddlewareFetchEvent) => {
  const url = new URL(req.url)

  if (url.pathname === "/from-middleware") {
    return new Response("hello from middleware: " + req.url)
  }

  if (url.pathname === "/todo") {
    return MiddlewareResponse.rewrite(
      "https://jsonplaceholder.typicode.com/todos/1",
    )
  }

  if (url.pathname === "/stream") {
    const { readable, writable } = new TransformStream()

    event.waitUntil(
      (async () => {
        const writer = writable.getWriter()
        const encoder = new TextEncoder()
        writer.write(encoder.encode("Hello, world! Streamed!"))
        writer.write(encoder.encode("response"))
        writer.close()
      })(),
    )

    return new Response(readable)
  }

  return MiddlewareResponse.next()
}
