import type { ApiComentario, Comentario } from '~/types/comentario.interface'
import { useComentarioService } from '~/services/comentario.service'

export function getAvatarUrl (usuario: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(usuario)}`
}

function mapComentario (comentario: ApiComentario, usuarioAtual?: { id?: string, nome?: string }): Comentario {
  const ehUsuarioAtual = usuarioAtual?.id === comentario.usuarioId
  const nome = ehUsuarioAtual && usuarioAtual?.nome
    ? usuarioAtual.nome
    : `Apoiador ${comentario.usuarioId.slice(0, 8)}`
  return {
    id: comentario.id,
    usuarioId: comentario.usuarioId,
    usuario: nome,
    texto: comentario.texto,
    avatar: getAvatarUrl(nome),
    likes: comentario.likes ?? 0,
    dislikes: comentario.dislikes ?? 0
  }
}

export function useComentarios () {
  const data = useState<Record<number, Comentario[]>>('comentarios-api', () => ({}))
  const loading = useState<Record<number, boolean>>('comentarios-loading', () => ({}))
  const errors = useState<Record<number, string>>('comentarios-errors', () => ({}))
  const submitting = useState<Record<number, boolean>>('comentarios-submitting', () => ({}))
  const comentarioService = useComentarioService()
  const { user } = useAuth()

  function getComentarios (postagemId: number): Comentario[] {
    return data.value[postagemId] ?? []
  }

  async function refresh (postagemId: number) {
    loading.value[postagemId] = true
    delete errors.value[postagemId]
    try {
      const page = await comentarioService.listar(postagemId, { size: 100, sort: 'data,asc' })
      data.value[postagemId] = page.content.map(item => mapComentario(item, user.value ?? undefined))
    } catch (cause) {
      errors.value[postagemId] = cause instanceof Error ? cause.message : 'Não foi possível carregar os comentários.'
    } finally {
      loading.value[postagemId] = false
    }
  }

  async function addComentario (postagemId: number, texto: string) {
    const conteudo = texto.trim()
    if (!conteudo) return
    submitting.value[postagemId] = true
    delete errors.value[postagemId]
    try {
      const created = await comentarioService.criar({ postagemId, texto: conteudo })
      data.value[postagemId] = [...getComentarios(postagemId), mapComentario(created, user.value ?? undefined)]
    } catch (cause) {
      errors.value[postagemId] = cause instanceof Error ? cause.message : 'Não foi possível enviar o comentário.'
      throw cause
    } finally {
      submitting.value[postagemId] = false
    }
  }

  return { getComentarios, refresh, addComentario, loading, errors, submitting, getAvatarUrl }
}
