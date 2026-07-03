import type { ApiPage, PageQuery } from '~/types/pagination.interface'
import type { ApiPostagem, PostagemCreateRequest, PostagemUpdateRequest } from '~/types/postagem.interface'
import type { HttpServiceClient } from './api-client'
import { useApiClient } from './api-client'

export class PostagemService {
  constructor (private readonly httpService: HttpServiceClient) {}

  listar (query: PageQuery = {}): Promise<ApiPage<ApiPostagem>> {
    return this.httpService.request<ApiPage<ApiPostagem>>('/publicacoes', { query })
  }

  criar (postagem: PostagemCreateRequest): Promise<ApiPostagem> {
    return this.httpService.request<ApiPostagem>('/publicacoes', {
      method: 'POST',
      body: postagem
    })
  }

  atualizar (id: number, postagem: PostagemUpdateRequest): Promise<ApiPostagem> {
    return this.httpService.request<ApiPostagem>(`/publicacoes/${id}`, {
      method: 'PUT',
      body: postagem
    })
  }

  remover (id: number): Promise<void> {
    return this.httpService.request<void>(`/publicacoes/${id}`, { method: 'DELETE' })
  }
}

export function usePostagemService (): PostagemService {
  return new PostagemService(useApiClient())
}
