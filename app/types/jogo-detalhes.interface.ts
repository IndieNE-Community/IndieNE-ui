export interface ComentarioMock {
  usuario: string
  texto: string
  likes: number
  dislikes: number
}

export interface Atualizacao {
  id?: number
  titulo: string
  data: string
  descricao: string
  imagem?: string
  comentarios: ComentarioMock[]
}

export interface DetalhesJogo {
  descricao: string
  valorArrecadado: number
  apoiadores: number
  dias: number
  metaValor: number
  fotos: string[]
  atualizacoes: Atualizacao[]
}
