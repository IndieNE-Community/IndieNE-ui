export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthSession()
  if (!auth.value?.token || auth.value.expiresAt <= Date.now()) {
    auth.value = null
    return navigateTo({ path: '/login', query: { redirecionar: to.fullPath } })
  }
})
