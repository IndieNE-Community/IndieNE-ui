import type { Comentario } from '~/types/comentario.interface'

// TODO(API): substituir a leitura e persistência em localStorage por ComentarioService.
const STORAGE_KEY = 'indiene_comentarios'
type ComentariosPorJogo = Record<string, Record<number, Comentario[]>>

function getAvatarUrl (usuario: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(usuario)}`
}

function deserializeComentarios (value: string): ComentariosPorJogo {
  const parsed = JSON.parse(value) as Record<string, Record<string, Comentario[]>>
  const comentarios: ComentariosPorJogo = {}

  for (const [jogoId, comentariosPorAtualizacao] of Object.entries(parsed)) {
    comentarios[jogoId] = {}
    for (const [indice, lista] of Object.entries(comentariosPorAtualizacao ?? {})) {
      comentarios[jogoId][Number(indice)] = lista.map(comentario => ({
        ...comentario,
        avatar: comentario.avatar || getAvatarUrl(comentario.usuario)
      }))
    }
  }

  return comentarios
}

export function useComentarios () {
  const data = useLocalStorageState<ComentariosPorJogo>(STORAGE_KEY, {
    defaultValue: () => ({}),
    deserialize: deserializeComentarios
  })

  function getComentarios (jogoId: string, atualizacaoIdx: number): Comentario[] {
    return data.value[jogoId]?.[atualizacaoIdx] ?? []
  }

  function addComentario (jogoId: string, atualizacaoIdx: number, usuario: string, texto: string) {
    const nome = usuario.trim() || 'Anônimo'
    const conteudo = texto.trim()
    if (!conteudo) return

    if (!data.value[jogoId]) data.value[jogoId] = {}
    if (!data.value[jogoId][atualizacaoIdx]) data.value[jogoId][atualizacaoIdx] = []
    data.value[jogoId][atualizacaoIdx].push({
      usuario: nome,
      texto: conteudo,
      avatar: getAvatarUrl(nome),
      likes: 0,
      dislikes: 0
    })
  }

  return { getComentarios, addComentario, getAvatarUrl }
}
