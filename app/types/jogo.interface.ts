export interface ApiJogo {
  id: number
  titulo: string
  descricao?: string
  metaFinanceira?: number
  campanha?: number
  dataInicio?: string
  dataConclusao?: string
  avaliacao?: number
  numJogadoresMin?: number
  numJogadoresMax?: number
  controle?: boolean
  imgThumb?: string
  usuarioId: string
  desenvolvedor?: string
  generos: string[]
  categorias: string[]
  plataformas: string[]
  totalArrecadado: number
  apoiadores: number
  metaPercentual: number
  diasRestantes?: number
}

export interface JogoCreateRequest {
  titulo: string
  descricao?: string | null
  metaFinanceira?: number | null
  campanha?: number | null
  dataInicio?: string | null
  dataConclusao?: string | null
  avaliacao?: number | null
  numJogadoresMin?: number | null
  numJogadoresMax?: number | null
  controle?: boolean | null
  imgThumb?: string | null
  generos?: string[]
  categorias?: string[]
  plataformas?: string[]
}

export interface JogoUpdateRequest extends JogoCreateRequest {}

export interface Jogo {
  id: string
  apiId: number
  title: string
  descricao: string
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
  valorArrecadado: number
  apoiadores: number
  metaValor: number
  dias: number
}
