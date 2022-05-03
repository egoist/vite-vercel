import { Request, Response, Headers, fetch, FormData } from "undici"
import { Blob as NodeBlob, File as NodeFile } from "@web-std/file"

globalThis.Request = globalThis.Request || Request
globalThis.Response = globalThis.Response || Response
globalThis.Headers = globalThis.Headers || Headers
globalThis.Blob = globalThis.Blob || NodeBlob
globalThis.File = globalThis.File || NodeFile
globalThis.fetch = globalThis.fetch || fetch
globalThis.FormData = globalThis.FormData || FormData
