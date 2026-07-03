import type { LoginRequest, LoginResponse } from '~/types/auth.interface'
import type { HttpServiceClient } from './api-client'
import { useApiClient } from './api-client'

export class AuthService {
  constructor (private readonly httpService: HttpServiceClient) {}

  login (credentials: LoginRequest): Promise<LoginResponse> {
    return this.httpService.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: credentials
    })
  }
}

export function useAuthService (): AuthService {
  return new AuthService(useApiClient())
}
