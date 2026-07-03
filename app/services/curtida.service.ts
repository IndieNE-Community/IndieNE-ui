import type { ApiCurtida, CurtidaCreateRequest } from '~/types/curtida.interface'
import type { ApiPage, PageQuery } from '~/types/pagination.interface'
import type { HttpServiceClient } from './api-client'
import { useApiClient } from './api-client'

type CurtidaQuery = PageQuery & ({ postagemId: number } | { comentarioId: number })

export class CurtidaService {
  constructor (private readonly httpService: HttpServiceClient) {}

  listar (query: CurtidaQuery): Promise<ApiPage<ApiCurtida>> {
    return this.httpService.request<ApiPage<ApiCurtida>>('/curtidas', { query })
  }

  criar (curtida: CurtidaCreateRequest): Promise<ApiCurtida> {
    return this.httpService.request<ApiCurtida>('/curtidas', {
      method: 'POST',
      body: curtida
    })
  }

  remover (id: number): Promise<void> {
    return this.httpService.request<void>(`/curtidas/${id}`, { method: 'DELETE' })
  }
}

export function useCurtidaService (): CurtidaService {
  return new CurtidaService(useApiClient())
}
