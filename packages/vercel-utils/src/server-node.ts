import type { IncomingMessage } from "http"
import { Readable } from "stream"
import { MiddlewareFetchEvent, MiddlewareRequest } from "./server"

/**
 * Create Web Headers from Node Headers
 */
function createHeaders(requestHeaders: Record<string, any>): Headers {
  let headers = new Headers()
  for (let key in requestHeaders) {
    let header = requestHeaders[key]!
    // set-cookie is an array (maybe others)
    if (Array.isArray(header)) {
      for (let value of header) {
        headers.append(key, value)
      }
    } else {
      headers.append(key, header)
    }
  }

  return headers
}

/**
 * Create Web Request from Node Incoming Message
 */
export function createRequest(req: IncomingMessage): Request {
  let host = req.headers["x-forwarded-host"] || req.headers["host"]
  // doesn't seem to be available on their req object!
  let protocol = req.headers["x-forwarded-proto"] || "https"
  let url = new URL(req.url!, `${protocol}://${host}`)

  let init: RequestInit = {
    method: req.method,
    headers: createHeaders(req.headers),
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    // @ts-expect-error
    init.body = req
  }

  return new MiddlewareRequest(url.href, init)
}

export function createFetchEvent(request: Request): MiddlewareFetchEvent {
  return new MiddlewareFetchEvent(request)
}

export function bodyStreamToNodeStream(bodyStream: ReadableStream): Readable {
  const reader = bodyStream.getReader()
  return Readable.from(
    (async function* () {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          return
        }
        yield value
      }
    })(),
  )
}
