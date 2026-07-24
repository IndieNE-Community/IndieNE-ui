import type { ApiJogo, JogoCreateRequest, JogoUpdateRequest } from '~/types/jogo.interface'
import type { ApiPage, PageQuery } from '~/types/pagination.interface'
import type { HttpServiceClient } from './api-client'
import { useApiClient } from './api-client'

export class JogoService {
  constructor (private readonly httpService: HttpServiceClient) {}

  listar (query: PageQuery = {}): Promise<ApiPage<ApiJogo>> {
    return this.httpService.request<ApiPage<ApiJogo>>('/jogos', { query })
  }

  buscar (id: number): Promise<ApiJogo> {
    return this.httpService.request<ApiJogo>(`/jogos/${id}`)
  }

  criar (jogo: JogoCreateRequest): Promise<ApiJogo> {
    return this.httpService.request<ApiJogo>('/jogos', {
      method: 'POST',
      body: jogo
    })
  }

  atualizar (id: number, jogo: JogoUpdateRequest): Promise<ApiJogo> {
    return this.httpService.request<ApiJogo>(`/jogos/${id}`, {
      method: 'PUT',
      body: jogo
    })
  }

  remover (id: number): Promise<void> {
    return this.httpService.request<void>(`/jogos/${id}`, { method: 'DELETE' })
  }
}

export function useJogoService (): JogoService {
  return new JogoService(useApiClient())
}
