export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const path = event.path.replace(/^\/api\/backend/, '')

  // A chamada do navegador é same-origin com o Nuxt. Não encaminhe esse
  // Origin ao Spring como se o navegador estivesse acessando a API diretamente.
  delete event.node.req.headers.origin

  return proxyRequest(event, `${config.backendBase}${path}`)
})
