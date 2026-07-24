export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthSession()

  if (auth.value?.user.tipo !== 'DESENVOLVEDOR') {
    return navigateTo('/perfil')
  }
})
