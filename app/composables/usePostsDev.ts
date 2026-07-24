import type { Atualizacao } from '~/types/jogo-detalhes.interface'
import type { ApiPostagem } from '~/types/postagem.interface'
import { usePostagemService } from '~/services/postagem.service'
import { useImagemService } from '~/services/imagem.service'

function mapPost (post: ApiPostagem, imagem?: string): Atualizacao {
  return {
    id: post.id, titulo: post.titulo, descricao: post.descricao || '',
    data: new Date(post.data).toLocaleString('pt-BR'), imagem, comentarios: []
  }
}

export function usePostsDev () {
  const data = useState<Record<string, Atualizacao[]>>('posts-dev-api', () => ({}))
  const loading = useState<Record<string, boolean>>('posts-dev-loading', () => ({}))
  const errors = useState<Record<string, string>>('posts-dev-errors', () => ({}))
  const postagemService = usePostagemService()
  const imagemService = useImagemService()
  const { getJogoById } = useMeusJogos()

  function getPosts (jogoId: string) { return data.value[jogoId] || [] }

  async function refresh (jogoId: string) {
    const jogo = getJogoById(jogoId)
    if (!jogo?.apiId) return
    loading.value[jogoId] = true
    delete errors.value[jogoId]
    try {
      // TODO(API): usar GET /publicacoes?jogoId quando o backend oferecer o filtro; o limite de 100 pode omitir publicações.
      const page = await postagemService.listar({ size: 100, sort: 'data,desc' })
      data.value[jogoId] = await Promise.all(page.content
        .filter(post => post.jogoId === jogo.apiId)
        .map(async (post) => {
          const imagens = await imagemService.listar({ postagemId: post.id })
          return mapPost(post, imagens[0]?.imagem)
        }))
    } catch (cause) {
      errors.value[jogoId] = cause instanceof Error ? cause.message : 'Não foi possível carregar as publicações.'
    } finally {
      loading.value[jogoId] = false
    }
  }

  async function addPost (jogoId: string, post: Omit<Atualizacao, 'comentarios'>) {
    const jogo = getJogoById(jogoId)
    if (!jogo?.apiId) throw new Error('Jogo não encontrado.')
    if (post.imagem?.startsWith('data:')) {
      throw new Error('O upload local ainda não é suportado. Publique sem imagem ou use uma URL quando essa opção estiver disponível.')
    }
    const created = await postagemService.criar({ jogoId: jogo.apiId, titulo: post.titulo, descricao: post.descricao })
    if (post.imagem) {
      try {
        await imagemService.criar({ postagemId: created.id, imagem: post.imagem })
      } catch {
        await postagemService.remover(created.id).catch(() => undefined)
        throw new Error('A publicação não foi criada porque sua imagem não pôde ser salva.')
      }
    }
    data.value[jogoId] = [mapPost(created, post.imagem), ...getPosts(jogoId)]
  }

  async function removePost (jogoId: string, postagemId: number) {
    await postagemService.remover(postagemId)
    data.value[jogoId] = getPosts(jogoId).filter(post => post.id !== postagemId)
  }

  return { getPosts, loading, errors, refresh, addPost, removePost }
}
