// TODO(API): substituir as reações em localStorage por CurtidaService.
const STORAGE_KEY = 'indiene_comentario_reacoes'

type Reacao = 'like' | 'dislike'
type ReacoesPorComentario = Record<string, Record<string, Reacao>>

function comentarioKey (jogoId: string, atualizacaoIdx: number, comentarioIdx: number) {
  return `${jogoId}:${atualizacaoIdx}:${comentarioIdx}`
}

export function useComentarioReacoes () {
  const data = useLocalStorageState<ReacoesPorComentario>(STORAGE_KEY, { defaultValue: () => ({}) })
  const { user } = useAuth()

  function getTotais (jogoId: string, atualizacaoIdx: number, comentarioIdx: number) {
    const reacoes = data.value[comentarioKey(jogoId, atualizacaoIdx, comentarioIdx)]
    if (!reacoes) return { likes: 0, dislikes: 0 }

    return Object.values(reacoes).reduce(
      (totais, reacao) => {
        totais[reacao === 'like' ? 'likes' : 'dislikes']++
        return totais
      },
      { likes: 0, dislikes: 0 }
    )
  }

  function getMinhaReacao (jogoId: string, atualizacaoIdx: number, comentarioIdx: number): Reacao | null {
    const email = user.value?.email
    if (!email) return null
    return data.value[comentarioKey(jogoId, atualizacaoIdx, comentarioIdx)]?.[email] ?? null
  }

  function setReacao (jogoId: string, atualizacaoIdx: number, comentarioIdx: number, tipo: Reacao) {
    const email = user.value?.email
    if (!email) return

    const key = comentarioKey(jogoId, atualizacaoIdx, comentarioIdx)
    if (!data.value[key]) data.value[key] = {}
    if (data.value[key][email] === tipo) delete data.value[key][email]
    else data.value[key][email] = tipo
  }

  return { getTotais, getMinhaReacao, setReacao }
}
