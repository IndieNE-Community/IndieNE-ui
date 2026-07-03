import type { ApiUser, UsuarioCreateRequest } from '~/types/user.interface'
import type { HttpServiceClient } from './api-client'
import { useApiClient } from './api-client'

export class UsuarioService {
  constructor (private readonly httpService: HttpServiceClient) {}

  cadastrar (usuario: UsuarioCreateRequest): Promise<ApiUser> {
    return this.httpService.request<ApiUser>('/usuarios', {
      method: 'POST',
      body: usuario
    })
  }
}

export function useUsuarioService (): UsuarioService {
  return new UsuarioService(useApiClient())
}
