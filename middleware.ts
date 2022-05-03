import { MiddlewareRequest, MiddlewareResponse } from "./src/server"

export default (req: MiddlewareRequest) => {
  const url = new URL(req.url)

  if (url.pathname === "/from-middleware") {
    return new Response("hello from middleware: " + req.url)
  }

  if (url.pathname === "/todo") {
    return MiddlewareResponse.rewrite(
      "https://jsonplaceholder.typicode.com/todos/1",
    )
  }

  return MiddlewareResponse.next()
}
