export interface DoacaoCreateRequest {
  jogoId: number
  valor: number
}

export interface ApiDoacao {
  id: number
  valor: number
  data: string
  jogoId: number
  usuarioId: string
}

export interface CampanhaResumo {
  jogoId: number
  metaFinanceira?: number | null
  totalArrecadado: number
  apoiadores: number
  metaPercentual: number
}
