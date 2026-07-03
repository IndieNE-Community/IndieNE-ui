import type { Atualizacao } from '~/types/jogo-detalhes.interface'
import type { ApiPostagem } from '~/types/postagem.interface'
import { usePostagemService } from '~/services/postagem.service'

function mapPost (post: ApiPostagem): Atualizacao {
  return {
    id: post.id, titulo: post.titulo, descricao: post.descricao || '',
    data: new Date(post.data).toLocaleString('pt-BR'), comentarios: []
  }
}

export function usePostsDev () {
  const data = useState<Record<string, Atualizacao[]>>('posts-dev-api', () => ({}))
  const postagemService = usePostagemService()
  const { getJogoById } = useMeusJogos()

  function getPosts (jogoId: string) { return data.value[jogoId] || [] }

  async function refresh (jogoId: string) {
    const jogo = getJogoById(jogoId)
    if (!jogo?.apiId) return
    const page = await postagemService.listar({ size: 100, sort: 'data,desc' })
    data.value[jogoId] = page.content.filter(post => post.jogoId === jogo.apiId).map(mapPost)
  }

  async function addPost (jogoId: string, post: Omit<Atualizacao, 'comentarios'>) {
    const jogo = getJogoById(jogoId)
    if (!jogo?.apiId) throw new Error('Jogo não encontrado.')
    const created = await postagemService.criar({ jogoId: jogo.apiId, titulo: post.titulo, descricao: post.descricao })
    data.value[jogoId] = [mapPost(created), ...getPosts(jogoId)]
  }

  return { getPosts, refresh, addPost }
}
