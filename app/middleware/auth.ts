export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthSession()
  if (!auth.value?.token || auth.value.expiresAt <= Date.now()) {
    auth.value = null
    return navigateTo('/login')
  }
})
