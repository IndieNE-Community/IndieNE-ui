import type { AuthSession } from '~/types/auth.interface'

const AUTH_COOKIE_NAME = 'indiene_auth'
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24

export function useAuthSession () {
  return useCookie<AuthSession | null>(AUTH_COOKIE_NAME, {
    maxAge: AUTH_COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    default: () => null
  })
}
