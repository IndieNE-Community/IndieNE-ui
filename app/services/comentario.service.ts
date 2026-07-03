import type { ApiComentario, ComentarioCreateRequest, ComentarioUpdateRequest } from '~/types/comentario.interface'
import type { ApiPage, PageQuery } from '~/types/pagination.interface'
import type { HttpServiceClient } from './api-client'
import { useApiClient } from './api-client'

interface ComentarioQuery extends PageQuery {
  postagemId: number
}

export class ComentarioService {
  constructor (private readonly httpService: HttpServiceClient) {}

  listar (postagemId: number, query: PageQuery = {}): Promise<ApiPage<ApiComentario>> {
    return this.httpService.request<ApiPage<ApiComentario>>('/comentarios', {
      query: { ...query, postagemId } satisfies ComentarioQuery
    })
  }

  criar (comentario: ComentarioCreateRequest): Promise<ApiComentario> {
    return this.httpService.request<ApiComentario>('/comentarios', {
      method: 'POST',
      body: comentario
    })
  }

  atualizar (id: number, comentario: ComentarioUpdateRequest): Promise<ApiComentario> {
    return this.httpService.request<ApiComentario>(`/comentarios/${id}`, {
      method: 'PUT',
      body: comentario
    })
  }

  remover (id: number): Promise<void> {
    return this.httpService.request<void>(`/comentarios/${id}`, { method: 'DELETE' })
  }
}

export function useComentarioService (): ComentarioService {
  return new ComentarioService(useApiClient())
}
