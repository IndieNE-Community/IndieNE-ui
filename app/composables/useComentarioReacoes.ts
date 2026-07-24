import type { ApiCurtida } from '~/types/curtida.interface'
import { useCurtidaService } from '~/services/curtida.service'

type Reacao = 'like' | 'dislike'

export function useComentarioReacoes () {
  const reacoes = useState<Record<number, ApiCurtida[]>>('comentario-reacoes-api', () => ({}))
  const loading = useState<Record<number, boolean>>('comentario-reacoes-loading', () => ({}))
  const errors = useState<Record<number, string>>('comentario-reacoes-errors', () => ({}))
  const curtidaService = useCurtidaService()
  const { user } = useAuth()

  function getMinhaReacao (comentarioId: number): Reacao | null {
    const atual = reacoes.value[comentarioId]?.find(item => item.usuarioId === user.value?.id)
    return atual?.tipo === 'dislike' ? 'dislike' : atual ? 'like' : null
  }

  async function refresh (comentarioId: number) {
    loading.value[comentarioId] = true
    delete errors.value[comentarioId]
    try {
      const page = await curtidaService.listar({ comentarioId, size: 100 })
      reacoes.value[comentarioId] = page.content
    } catch (cause) {
      errors.value[comentarioId] = cause instanceof Error ? cause.message : 'Não foi possível carregar as reações.'
    } finally {
      loading.value[comentarioId] = false
    }
  }

  async function setReacao (comentarioId: number, tipo: Reacao) {
    if (!user.value) return
    loading.value[comentarioId] = true
    delete errors.value[comentarioId]
    try {
      const atual = reacoes.value[comentarioId]?.find(item => item.usuarioId === user.value?.id)
      if (atual) await curtidaService.remover(atual.id)
      if (!atual || atual.tipo !== tipo) {
        const created = await curtidaService.criar({ comentarioId, tipo })
        reacoes.value[comentarioId] = [
          ...(reacoes.value[comentarioId] ?? []).filter(item => item.id !== atual?.id),
          created
        ]
      } else {
        reacoes.value[comentarioId] = (reacoes.value[comentarioId] ?? []).filter(item => item.id !== atual.id)
      }
    } catch (cause) {
      errors.value[comentarioId] = cause instanceof Error ? cause.message : 'Não foi possível registrar a reação.'
      throw cause
    } finally {
      loading.value[comentarioId] = false
    }
  }

  return { getMinhaReacao, refresh, setReacao, loading, errors }
}
