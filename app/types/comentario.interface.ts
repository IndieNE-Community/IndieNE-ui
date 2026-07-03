export interface ApiComentario {
  id: number
  texto: string
  data: string
  postagemId: number
  usuarioId: string
}

export interface ComentarioCreateRequest {
  texto: string
  postagemId: number
}

export interface ComentarioUpdateRequest {
  texto: string
}

export interface Comentario {
  usuario: string
  texto: string
  avatar: string
  likes: number
  dislikes: number
}
