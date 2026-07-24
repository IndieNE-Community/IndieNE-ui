export interface ApiComentario {
  id: number
  texto: string
  data: string
  postagemId: number
  usuarioId: string
  likes: number
  dislikes: number
}

export interface ComentarioCreateRequest {
  texto: string
  postagemId: number
}

export interface ComentarioUpdateRequest {
  texto: string
}

export interface Comentario {
  id: number
  usuarioId: string
  usuario: string
  texto: string
  avatar: string
  likes: number
  dislikes: number
}
