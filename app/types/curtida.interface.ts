export interface ApiCurtida {
  id: number
  tipo?: string
  postagemId?: number
  comentarioId?: number
  usuarioId: string
}

export interface CurtidaCreateRequest {
  tipo?: string
  postagemId?: number
  comentarioId?: number
}
