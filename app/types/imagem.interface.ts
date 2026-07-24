export interface ImagemCreateRequest {
  jogoId?: number
  postagemId?: number
  imagem: string
}

export interface ApiImagem extends ImagemCreateRequest {
  id: number
}
