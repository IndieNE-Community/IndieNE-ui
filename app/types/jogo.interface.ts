export interface ApiJogo {
  id: number
  titulo: string
  descricao?: string
  metaFinanceira?: number
  campanha?: number
  dataInicio?: string
  dataConclusao?: string
  numJogadores?: number
  genero?: string
  controle?: boolean
  imgThumb?: string
  usuarioId: string
}

export interface JogoCreateRequest {
  titulo: string
  descricao?: string | null
  metaFinanceira?: number | null
  campanha?: number | null
  dataInicio?: string | null
  dataConclusao?: string | null
  numJogadores?: number | null
  genero?: string | null
  controle?: boolean | null
  imgThumb?: string | null
}

export interface JogoUpdateRequest extends JogoCreateRequest {}

export interface Jogo {
  id: string
  title: string
  thumb?: string
  genero: string[]
  desenvolvedor: string
  rating: string
  metaPercentual: number
  dataPostagem: string
  dataConclusao?: string
  qtdeJogadores: string
  compatControle: boolean
  so: string[]
  categorias: string[]
}
