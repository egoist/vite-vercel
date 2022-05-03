import { MiddlewareResponse } from "./src/server-runtime"

export default (req: Request) => {
  const url = new URL(req.url)

  if (url.pathname === "/") {
    return MiddlewareResponse.next()
  }

  return new Response("hello from middleware: " + req.url)
}
