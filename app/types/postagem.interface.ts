export interface ApiPostagem {
  id: number
  titulo: string
  descricao?: string
  data: string
  jogoId: number
  usuarioId: string
}

export interface PostagemCreateRequest {
  titulo: string
  descricao?: string | null
  jogoId: number
}

export interface PostagemUpdateRequest {
  titulo: string
  descricao?: string | null
}
