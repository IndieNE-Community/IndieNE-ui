import type { Atualizacao } from '~/types/jogo-detalhes.interface'
import { useImagemService } from '~/services/imagem.service'
import { useJogoService } from '~/services/jogo.service'
import { usePostagemService } from '~/services/postagem.service'
import { formatarMoeda } from '~/utils/moeda'
import { slugify } from '~/utils/slug'

interface FotoPost {
  src: string
  titulo: string
}

const jogoVazio = () => ({
  titulo: '',
  descricao: '',
  tags: [] as string[],
  desenvolvedor: '',
  hero: '',
  valorArrecadado: 0,
  apoiadores: 0,
  dias: 0,
  metaPercentual: 0,
  metaValor: 0,
  fotos: [] as string[],
  atualizacoes: [] as Atualizacao[]
})

export function useJogoDetalhes () {
  const route = useRoute()
  const id = computed(() => route.params.id as string)
  const jogo = ref(jogoVazio())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { user, isLoggedIn } = useAuth()
  const jogoService = useJogoService()
  const postagemService = usePostagemService()
  const imagemService = useImagemService()
  const comentarios = useComentarios()
  const reacoes = useComentarioReacoes()

  async function carregar () {
    const jogoId = Number(id.value)
    if (!Number.isInteger(jogoId) || jogoId <= 0) {
      error.value = 'Jogo inválido.'
      return
    }
    loading.value = true
    error.value = null
    try {
      const [apiJogo, imagensJogo, paginaPosts] = await Promise.all([
        jogoService.buscar(jogoId),
        imagemService.listar({ jogoId }),
        postagemService.listar({ size: 100, sort: 'data,desc' })
      ])
      // TODO(API): usar GET /publicacoes?jogoId quando o backend oferecer o filtro.
      const posts = paginaPosts.content.filter(post => post.jogoId === jogoId)
      const atualizacoes = await Promise.all(posts.map(async (post): Promise<Atualizacao> => {
        const imagens = await imagemService.listar({ postagemId: post.id })
        await comentarios.refresh(post.id)
        await Promise.all(comentarios.getComentarios(post.id).map(item => reacoes.refresh(item.id)))
        return {
          id: post.id,
          titulo: post.titulo,
          descricao: post.descricao ?? '',
          data: new Date(post.data).toLocaleString('pt-BR'),
          imagem: imagens[0]?.imagem,
          comentarios: []
        }
      }))
      const fotos = imagensJogo.map(item => item.imagem)
      jogo.value = {
        titulo: apiJogo.titulo,
        descricao: apiJogo.descricao ?? '',
        tags: apiJogo.generos ?? [],
        desenvolvedor: apiJogo.desenvolvedor || 'Desenvolvedor independente',
        hero: apiJogo.imgThumb || fotos[0] || '',
        valorArrecadado: apiJogo.totalArrecadado ?? 0,
        apoiadores: apiJogo.apoiadores ?? 0,
        dias: apiJogo.diasRestantes ?? apiJogo.campanha ?? 0,
        metaPercentual: apiJogo.metaPercentual ?? 0,
        metaValor: apiJogo.metaFinanceira ?? 0,
        fotos,
        atualizacoes
      }
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Não foi possível carregar o jogo.'
      jogo.value = jogoVazio()
    } finally {
      loading.value = false
    }
  }

  const slugDev = computed(() => slugify(jogo.value.desenvolvedor))
  const comentarioForms = ref<Record<number, { texto: string }>>({})

  function postagemId (atualizacaoIdx: number): number | undefined {
    return jogo.value.atualizacoes[atualizacaoIdx]?.id
  }

  function comentariosPorAtualizacao (atualizacaoIdx: number) {
    const idPostagem = postagemId(atualizacaoIdx)
    return idPostagem ? comentarios.getComentarios(idPostagem) : []
  }

  function getForm (idx: number) {
    comentarioForms.value[idx] ??= { texto: '' }
    return comentarioForms.value[idx]
  }

  async function enviarComentario (idx: number) {
    const idPostagem = postagemId(idx)
    const formulario = getForm(idx)
    if (!idPostagem || !formulario.texto.trim()) return
    await comentarios.addComentario(idPostagem, formulario.texto)
    formulario.texto = ''
  }

  function comentarioPorIndice (atualizacaoIdx: number, comentarioIdx: number) {
    return comentariosPorAtualizacao(atualizacaoIdx)[comentarioIdx]
  }

  function totalLikes (atualizacaoIdx: number, comentarioIdx: number) {
    return comentarioPorIndice(atualizacaoIdx, comentarioIdx)?.likes ?? 0
  }

  function totalDislikes (atualizacaoIdx: number, comentarioIdx: number) {
    return comentarioPorIndice(atualizacaoIdx, comentarioIdx)?.dislikes ?? 0
  }

  function reacaoAtual (atualizacaoIdx: number, comentarioIdx: number) {
    const comentario = comentarioPorIndice(atualizacaoIdx, comentarioIdx)
    return comentario ? reacoes.getMinhaReacao(comentario.id) : null
  }

  async function reagir (atualizacaoIdx: number, comentarioIdx: number, tipo: 'like' | 'dislike') {
    const comentario = comentarioPorIndice(atualizacaoIdx, comentarioIdx)
    const idPostagem = postagemId(atualizacaoIdx)
    if (!comentario || !idPostagem) return
    await reacoes.setReacao(comentario.id, tipo)
    await comentarios.refresh(idPostagem)
  }

  const avatarUsuarioAtual = computed(() =>
    comentarios.getAvatarUrl(user.value?.nome || user.value?.email || 'anon')
  )
  const totalApoiadores = computed(() => jogo.value.apoiadores)
  const valorArrecadadoFormatado = computed(() => formatarMoeda(jogo.value.valorArrecadado))
  const percentualMeta = computed(() => jogo.value.metaPercentual)
  const fotosDosPosts = computed<FotoPost[]>(() => [
    ...jogo.value.fotos.map((src, indice) => ({ src, titulo: `${jogo.value.titulo} — imagem ${indice + 1}` })),
    ...jogo.value.atualizacoes.flatMap(post => post.imagem ? [{ src: post.imagem, titulo: post.titulo }] : [])
  ])
  const { itemSelecionado: fotoModal, abrir: abrirFotoModal, fechar: fecharFotoModal } = useModal<FotoPost>()

  function comentarioLoading (idx: number) {
    const idPostagem = postagemId(idx)
    return idPostagem ? Boolean(comentarios.submitting.value[idPostagem]) : false
  }

  function comentarioErro (idx: number) {
    const idPostagem = postagemId(idx)
    return idPostagem ? comentarios.errors.value[idPostagem] : undefined
  }

  return {
    id, jogo, loading, error, carregar, slugDev, comentariosPorAtualizacao,
    totalLikes, totalDislikes, reacaoAtual, reagir, getForm, enviarComentario,
    comentarioLoading, comentarioErro, isLoggedIn, avatarUsuarioAtual,
    totalApoiadores, valorArrecadadoFormatado, percentualMeta, formatarMoeda,
    fotosDosPosts, fotoModal, abrirFotoModal, fecharFotoModal
  }
}
