export function validateURL(url: string | URL): string {
  try {
    return String(new URL(String(url)))
  } catch (error: any) {
    throw new Error(`URLs is malformed. Please use only absolute URLs`)
  }
}
