import type { ContribuicaoJogo } from '~/types/contribuicao.interface'
import type { CampanhaResumo } from '~/types/doacao.interface'
import { useDoacaoService } from '~/services/doacao.service'

export function useContribuicoes () {
  const data = useState<Record<string, ContribuicaoJogo>>('contribuicoes-sessao', () => ({}))
  const resumos = useState<Record<string, CampanhaResumo>>('resumos-campanhas-api', () => ({}))
  const doacaoService = useDoacaoService()

  function getExtra (jogoId: string): ContribuicaoJogo {
    return data.value[jogoId] ?? { valorExtra: 0, apoiadoresExtra: 0 }
  }

  async function carregarResumo (jogoId: string): Promise<CampanhaResumo> {
    const id = Number(jogoId)
    if (!Number.isInteger(id) || id <= 0) throw new Error('Jogo inválido.')
    const resumo = await doacaoService.buscarResumo(id)
    resumos.value[jogoId] = resumo
    return resumo
  }

  async function addContribuicao (jogoId: string, valor: number): Promise<void> {
    const id = Number(jogoId)
    if (!Number.isInteger(id) || id <= 0) throw new Error('Jogo inválido.')
    if (valor <= 0) throw new Error('Informe um valor maior que zero.')
    await doacaoService.criar({ jogoId: id, valor })
    const atual = getExtra(jogoId)
    data.value[jogoId] = {
      valorExtra: atual.valorExtra + valor,
      apoiadoresExtra: atual.apoiadoresExtra + 1
    }
    const resumo = await carregarResumo(jogoId)
    const catalogo = useState<import('~/types/jogo.interface').Jogo[]>('catalogo-publico-api')
    const jogoPublico = catalogo.value?.find(jogo => jogo.id === jogoId)
    if (jogoPublico) {
      jogoPublico.valorArrecadado = resumo.totalArrecadado
      jogoPublico.apoiadores = resumo.apoiadores
      jogoPublico.metaPercentual = resumo.metaPercentual
    }
    const jogosDev = useState<import('~/types/jogo-dev.interface').JogoDev[]>('meus-jogos-api')
    const jogoDev = jogosDev.value?.find(jogo => jogo.id === jogoId)
    if (jogoDev) {
      jogoDev.valorArrecadado = `R$ ${resumo.totalArrecadado}`
      jogoDev.apoiadores = resumo.apoiadores
      jogoDev.metaPercentual = resumo.metaPercentual
    }
  }

  function getResumo (jogoId: string): CampanhaResumo | undefined {
    return resumos.value[jogoId]
  }

  return { getExtra, getResumo, carregarResumo, addContribuicao }
}
