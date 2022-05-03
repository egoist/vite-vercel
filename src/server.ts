import { validateURL } from "./server-utils"

const REDIRECTS = new Set([301, 302, 303, 307, 308])

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

  static redirect(url: string | URL, status = 307) {
    if (!REDIRECTS.has(status)) {
      throw new RangeError(
        'Failed to execute "redirect" on "response": Invalid status code',
      )
    }

    const destination = validateURL(url)
    return new MiddlewareResponse(destination, {
      headers: { Location: destination },
      status,
    })
  }
}
