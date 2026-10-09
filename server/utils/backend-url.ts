import { createError } from 'h3'

export function backendRequestUrl (base: string, path: string): string {
  let url: URL
  try {
    url = new URL(base)
  } catch {
    throw createError({ statusCode: 500, message: 'Defina NUXT_BACKEND_BASE com uma URL HTTP ou HTTPS válida.' })
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.href.includes('?') || url.href.includes('#')) {
    throw createError({ statusCode: 500, message: 'NUXT_BACKEND_BASE deve ser uma URL HTTP ou HTTPS sem query ou fragmento.' })
  }
  return `${url.toString().replace(/\/+$/, '')}${path}`
}
