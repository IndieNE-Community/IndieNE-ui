import { useImagemService } from '~/services/imagem.service'
import { usePostagemService } from '~/services/postagem.service'

export interface PublicacaoPublica {
  id: number
  titulo: string
  descricao: string
  data: string
  jogoId: string
  autor: string
  thumb?: string
}

export function usePublicacoesPublicas () {
  const publicacoes = useState<PublicacaoPublica[]>('publicacoes-publicas-api', () => [])
  const loading = useState('publicacoes-publicas-loading', () => false)
  const error = useState<string | null>('publicacoes-publicas-error', () => null)
  const postagemService = usePostagemService()
  const imagemService = useImagemService()
  const { allJogos } = useJogos()

  async function refresh () {
    loading.value = true
    error.value = null
    try {
      const page = await postagemService.listar({ size: 100, sort: 'data,desc' })
      publicacoes.value = await Promise.all(page.content.map(async (postagem) => {
        const jogo = allJogos.value.find(item => item.apiId === postagem.jogoId)
        const imagens = await imagemService.listar({ postagemId: postagem.id })
        return {
          id: postagem.id,
          titulo: postagem.titulo,
          descricao: postagem.descricao ?? '',
          data: postagem.data,
          jogoId: String(postagem.jogoId),
          autor: jogo?.title ?? `Jogo #${postagem.jogoId}`,
          thumb: imagens[0]?.imagem
        }
      }))
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Não foi possível carregar as publicações.'
    } finally {
      loading.value = false
    }
  }

  return { publicacoes, loading, error, refresh }
}
