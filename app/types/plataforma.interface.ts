export interface PlataformaCreateRequest {
  jogoId: number
  plataforma: string
}

export interface ApiPlataforma extends PlataformaCreateRequest {
  id: number
}
