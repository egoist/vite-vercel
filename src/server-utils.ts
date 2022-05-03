export function validateURL(url: string | URL): string {
  try {
    return String(new URL(String(url)))
  } catch (error: any) {
    throw new Error(`URLs is malformed. Please use only absolute URLs`)
  }
}

// Should kept in sync with Next.js https://cs.github.com/vercel/next.js/blob/4a8a3d2400a54448b615fbc75cd91ca8cfea256c/packages/next/server/utils.ts#L18
export function isBot(userAgent: string): boolean {
  return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(
    userAgent,
  )
}
