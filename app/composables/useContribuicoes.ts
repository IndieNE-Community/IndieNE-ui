import type { ContribuicaoJogo } from '~/types/contribuicao.interface'

// TODO(API): persistir contribuições no backend quando houver endpoint e contrato disponíveis.
const STORAGE_KEY = 'indiene_contribuicoes'

export function useContribuicoes () {
  const data = useLocalStorageState<Record<string, ContribuicaoJogo>>(STORAGE_KEY, { defaultValue: () => ({}) })

  function getExtra (jogoId: string): ContribuicaoJogo {
    return data.value[jogoId] ?? { valorExtra: 0, apoiadoresExtra: 0 }
  }

  function addContribuicao (jogoId: string, valor: number): void {
    if (valor <= 0) return
    const atual = getExtra(jogoId)
    data.value[jogoId] = {
      valorExtra: atual.valorExtra + valor,
      apoiadoresExtra: atual.apoiadoresExtra + 1
    }
  }

  return { getExtra, addContribuicao }
}
