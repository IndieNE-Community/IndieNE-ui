export function buildAvatarUrl (base: string, seed: string): string {
  let url: URL
  try {
    url = new URL(base)
  } catch {
    throw new Error('Defina NUXT_PUBLIC_AVATAR_BASE com uma URL HTTP ou HTTPS válida.')
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('NUXT_PUBLIC_AVATAR_BASE deve ser uma URL HTTP ou HTTPS.')
  }
  url.searchParams.set('seed', seed)
  return url.toString()
}
