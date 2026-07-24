import type { ApiUser } from './user.interface'

export interface AuthSession {
  token: string
  expiresAt: number
  user: ApiUser
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
  expiresIn: number
  usuario: ApiUser
}
