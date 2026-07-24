import type { ApiImagem, ImagemCreateRequest } from '~/types/imagem.interface'
import type { HttpServiceClient } from './api-client'
import { useApiClient } from './api-client'

type ImagemQuery = { jogoId: number } | { postagemId: number }

export class ImagemService {
  constructor (private readonly httpService: HttpServiceClient) {}
  listar (query: ImagemQuery): Promise<ApiImagem[]> {
    return this.httpService.request<ApiImagem[]>('/imagens', { query })
  }
  criar (imagem: ImagemCreateRequest): Promise<ApiImagem> {
    return this.httpService.request<ApiImagem>('/imagens', { method: 'POST', body: imagem })
  }
  remover (id: number): Promise<void> {
    return this.httpService.request<void>(`/imagens/${id}`, { method: 'DELETE' })
  }
}

export function useImagemService (): ImagemService {
  return new ImagemService(useApiClient())
}
