import { getDetalhesJogo } from '~/data/jogo-detalhes'

export interface BaseCampanha {
  valorNumerico: number
  apoiadores: number
  metaNumerico: number
}

export function getBaseCampanha (jogoId: string): BaseCampanha {
  const detalhes = getDetalhesJogo(jogoId)
  return {
    valorNumerico: detalhes.valorArrecadado,
    apoiadores: detalhes.apoiadores,
    metaNumerico: detalhes.metaValor
  }
}
