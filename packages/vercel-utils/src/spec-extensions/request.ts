import { Request } from "next/dist/server/web/spec-compliant/request"

export class MiddlewareRequest extends Request {
  /** Only available on Vercel */
  geo?: {
    city?: string
    country?: string
    region?: string
    latitude?: string
    longitude?: string
  }

  /** Only available on Vercel */
  ip?: string
}
