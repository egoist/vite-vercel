export default (req: Request) => {
  // @ts-expect-error
  console.log(globalThis.NextResponse)
  return new Response("hello from middleware: " + req.url)
}
