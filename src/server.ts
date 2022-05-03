export class MiddlewareResponse extends Response {
  static next() {
    const response = new Response()

    response.headers.set("x-middleware-next", "1")

    return response
  }
}
