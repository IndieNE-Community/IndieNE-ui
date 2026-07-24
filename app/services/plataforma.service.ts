import type { ApiPlataforma, PlataformaCreateRequest } from '~/types/plataforma.interface'
import type { HttpServiceClient } from './api-client'
import { useApiClient } from './api-client'

export class PlataformaService {
  constructor (private readonly httpService: HttpServiceClient) {}
  listar (jogoId: number): Promise<ApiPlataforma[]> {
    return this.httpService.request<ApiPlataforma[]>('/plataformas', { query: { jogoId } })
  }
  criar (plataforma: PlataformaCreateRequest): Promise<ApiPlataforma> {
    return this.httpService.request<ApiPlataforma>('/plataformas', { method: 'POST', body: plataforma })
  }
  remover (id: number): Promise<void> {
    return this.httpService.request<void>(`/plataformas/${id}`, { method: 'DELETE' })
  }
}

export function usePlataformaService (): PlataformaService {
  return new PlataformaService(useApiClient())
}
