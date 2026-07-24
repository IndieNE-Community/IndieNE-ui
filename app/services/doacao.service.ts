import type { ApiDoacao, CampanhaResumo, DoacaoCreateRequest } from '~/types/doacao.interface'
import type { ApiPage, PageQuery } from '~/types/pagination.interface'
import type { HttpServiceClient } from './api-client'
import { useApiClient } from './api-client'

export class DoacaoService {
  constructor (private readonly httpService: HttpServiceClient) {}

  criar (doacao: DoacaoCreateRequest): Promise<ApiDoacao> {
    return this.httpService.request<ApiDoacao>('/doacoes', { method: 'POST', body: doacao })
  }

  listar (jogoId: number, query: PageQuery = {}): Promise<ApiPage<ApiDoacao>> {
    return this.httpService.request<ApiPage<ApiDoacao>>('/doacoes', { query: { ...query, jogoId } })
  }

  buscarResumo (jogoId: number): Promise<CampanhaResumo> {
    return this.httpService.request<CampanhaResumo>('/doacoes/resumo', { query: { jogoId } })
  }

  remover (id: number): Promise<void> {
    return this.httpService.request<void>(`/doacoes/${id}`, { method: 'DELETE' })
  }
}

export function useDoacaoService (): DoacaoService {
  return new DoacaoService(useApiClient())
}
