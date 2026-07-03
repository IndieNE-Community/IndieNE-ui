export interface ApiUser {
  id: string
  nome: string
  email: string
  tipo: 'DESENVOLVEDOR' | 'USUARIO_COMUM'
}

export interface UsuarioCreateRequest {
  nome: string
  email: string
  senha: string
  tipo: ApiUser['tipo']
}
