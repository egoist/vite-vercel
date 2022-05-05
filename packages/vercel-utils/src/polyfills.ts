import "web-streams-polyfill/es2018"
import fetch, { FormData } from "node-fetch"
import { Blob as NodeBlob, File as NodeFile } from "@web-std/file"
import { Response } from "next/dist/server/web/spec-compliant/response"
import { Request } from "next/dist/server/web/spec-compliant/request"
import { Headers } from "next/dist/server/web/spec-compliant/headers"

globalThis.Request = globalThis.Request || Request
globalThis.Response = globalThis.Response || Response
globalThis.Headers = globalThis.Headers || Headers
globalThis.Blob = globalThis.Blob || NodeBlob
globalThis.File = globalThis.File || NodeFile
globalThis.fetch = globalThis.fetch || fetch
globalThis.FormData = globalThis.FormData || FormData
