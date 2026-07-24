import { useAuthService } from '~/services/auth.service'
import { useUsuarioService } from '~/services/usuario.service'
import type { ApiUser } from '~/types/user.interface'

export function useAuth () {
  const authCookie = useAuthSession()
  const authService = useAuthService()
  const usuarioService = useUsuarioService()

  const user = computed(() => authCookie.value?.user ?? null)
  const isLoggedIn = computed(() => Boolean(authCookie.value?.token && authCookie.value.expiresAt > Date.now()))
  const isDeveloper = computed(() => user.value?.tipo === 'DESENVOLVEDOR')

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

  async function register (nome: string, email: string, senha: string, tipo: ApiUser['tipo']) {
    try {
      await usuarioService.cadastrar({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        tipo
      })
      return await login(email, senha)
    } catch (error) {
      return { ok: false as const, erro: error instanceof Error ? error.message : 'Erro ao cadastrar.' }
    }
  }

  function logout () { authCookie.value = null }

  return { user, isLoggedIn, isDeveloper, login, register, logout }
}
