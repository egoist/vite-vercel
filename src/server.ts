import { validateURL } from "./server-utils"

export class MiddlewareResponse extends Response {
  static rewrite(destination: string | URL) {
    return new MiddlewareResponse(null, {
      headers: {
        "x-middleware-rewrite": validateURL(destination),
      },
    })
  }

  static next() {
    return new MiddlewareResponse(null, {
      headers: {
        "x-middleware-next": "1",
      },
    })
  }
}
