import { useAuthService } from '~/services/auth.service'
import { useUsuarioService } from '~/services/usuario.service'

export function useAuth () {
  const authCookie = useAuthSession()
  const authService = useAuthService()
  const usuarioService = useUsuarioService()

  const user = computed(() => authCookie.value?.user ?? null)
  const isLoggedIn = computed(() => Boolean(authCookie.value?.token && authCookie.value.expiresAt > Date.now()))

  async function login (email: string, senha: string) {
    try {
      const response = await authService.login({ email: email.trim().toLowerCase(), senha })
      authCookie.value = {
        token: response.token,
        expiresAt: Date.now() + response.expiresIn,
        user: response.usuario
      }
      return { ok: true as const }
    } catch (error) {
      return { ok: false as const, erro: error instanceof Error ? error.message : 'Erro ao entrar.' }
    }
  }

  async function register (nome: string, email: string, senha: string) {
    try {
      await usuarioService.cadastrar({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        tipo: 'DESENVOLVEDOR'
      })
      return await login(email, senha)
    } catch (error) {
      return { ok: false as const, erro: error instanceof Error ? error.message : 'Erro ao cadastrar.' }
    }
  }

  function logout () { authCookie.value = null }

  return { user, isLoggedIn, login, register, logout }
}
