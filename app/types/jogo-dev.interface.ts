export interface JogoDev {
  id: string
  apiId?: number
  title: string
  descricao: string
  thumb: string
  fotos: string[]
  genero: string[]
  desenvolvedor: string
  metaPercentual: number
  valorArrecadado: string
  metaValor: string
  apoiadores: number
  dias: number
  dataPostagem: string
  dataConclusao: string
  qtdeJogadores: string
  compatControle: boolean
  so: string[]
}

export function jogoDevVazio (): Omit<JogoDev, 'id'> {
  return {
    title: '',
    descricao: '',
    thumb: '',
    fotos: [],
    genero: [],
    desenvolvedor: 'To The Sky',
    metaPercentual: 0,
    valorArrecadado: '',
    metaValor: '',
    apoiadores: 0,
    dias: 0,
    dataPostagem: new Date().toISOString().slice(0, 7),
    dataConclusao: '',
    qtdeJogadores: '1',
    compatControle: false,
    so: []
  }
}
