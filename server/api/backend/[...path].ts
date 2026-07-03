export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const path = event.path.replace(/^\/api\/backend/, '')
  return proxyRequest(event, `${config.backendBase}${path}`)
})
