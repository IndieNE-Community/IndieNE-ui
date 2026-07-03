// TODO(API): buscar jogo, campanha, atualizações e comentários por ID; hoje parte dos detalhes ainda é local.
import type { Comentario } from '~/types/comentario.interface'
import { getDetalhesJogo } from '~/data/jogo-detalhes'
import { getBaseCampanha } from '~/utils/campanha'
import { formatarMoeda } from '~/utils/moeda'
import { jogos } from '~/data/jogos'
import { slugify } from '~/utils/slug'

interface FotoPost {
  src: string
  titulo: string
}

export function useJogoDetalhes () {
  const route = useRoute()
  const id = computed(() => route.params.id as string)

  const { user, isLoggedIn } = useAuth()
  const { getComentarios, addComentario, getAvatarUrl } = useComentarios()
  const { getTotais: getReacoesTotais, getMinhaReacao, setReacao } = useComentarioReacoes()
  const { getExtra } = useContribuicoes()
  const { getPosts: getPostsDev } = usePostsDev()
  const { getJogoById } = useMeusJogos()

  const jogo = computed(() => {
    const item = jogos.find(jogo => jogo.id === id.value)
    const detalhes = getDetalhesJogo(id.value)
    const jogoDoUsuario = getJogoById(id.value)

    if (!item) {
      return {
        titulo: 'Jogo não encontrado',
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
        atualizacoes: [] as {
          titulo: string
          data: string
          descricao: string
          imagem: string
          comentarios: { usuario: string, texto: string, likes: number, dislikes: number }[]
        }[]
      }
    }

    return {
      titulo: item.title,
      descricao: jogoDoUsuario?.descricao ?? detalhes.descricao,
      tags: item.genero,
      desenvolvedor: item.desenvolvedor,
      hero: jogoDoUsuario?.thumb ?? item.thumb ?? '',
      valorArrecadado: detalhes.valorArrecadado,
      apoiadores: detalhes.apoiadores,
      dias: detalhes.dias,
      metaPercentual: item.metaPercentual,
      metaValor: detalhes.metaValor,
      fotos: detalhes.fotos,
      atualizacoes: [...getPostsDev(id.value), ...detalhes.atualizacoes]
    }
  })

  const slugDev = computed(() => slugify(jogo.value.desenvolvedor))

  function comentariosPorAtualizacao (atualizacaoIdx: number): Comentario[] {
    const comentariosBase = jogo.value.atualizacoes[atualizacaoIdx]?.comentarios ?? []
    const comentariosComAvatar = comentariosBase.map(comentario => ({
      usuario: comentario.usuario,
      texto: comentario.texto,
      avatar: getAvatarUrl(comentario.usuario),
      likes: comentario.likes,
      dislikes: comentario.dislikes
    }))
    const comentariosSalvos = getComentarios(id.value, atualizacaoIdx)

    return [...comentariosComAvatar, ...comentariosSalvos]
  }

  function totalLikes (atualizacaoIdx: number, comentarioIdx: number): number {
    const comentario = comentariosPorAtualizacao(atualizacaoIdx)[comentarioIdx]
    if (!comentario) return 0

    const extra = getReacoesTotais(id.value, atualizacaoIdx, comentarioIdx)
    return comentario.likes + extra.likes
  }

  function totalDislikes (atualizacaoIdx: number, comentarioIdx: number): number {
    const comentario = comentariosPorAtualizacao(atualizacaoIdx)[comentarioIdx]
    if (!comentario) return 0

    const extra = getReacoesTotais(id.value, atualizacaoIdx, comentarioIdx)
    return comentario.dislikes + extra.dislikes
  }

  function reacaoAtual (atualizacaoIdx: number, comentarioIdx: number) {
    return getMinhaReacao(id.value, atualizacaoIdx, comentarioIdx)
  }

  function reagir (atualizacaoIdx: number, comentarioIdx: number, tipo: 'like' | 'dislike') {
    setReacao(id.value, atualizacaoIdx, comentarioIdx, tipo)
  }

  const comentarioForms = ref<Record<number, { texto: string }>>({})
  watch(
    () => jogo.value.atualizacoes.length,
    (quantidade) => {
      const formularios: Record<number, { texto: string }> = {}
      for (let idx = 0; idx < quantidade; idx++) {
        formularios[idx] = comentarioForms.value[idx] ?? { texto: '' }
      }
      comentarioForms.value = formularios
    },
    { immediate: true }
  )

  function getForm (idx: number) {
    return comentarioForms.value[idx] ?? { texto: '' }
  }

  function enviarComentario (idx: number) {
    const formulario = getForm(idx)
    const texto = formulario.texto.trim()
    if (!texto) return

    const nome = user.value?.nome || user.value?.email || 'Anônimo'
    addComentario(id.value, idx, nome, texto)
    formulario.texto = ''
  }

  const avatarUsuarioAtual = computed(() =>
    user.value?.nome
      ? getAvatarUrl(user.value.nome)
      : 'https://api.dicebear.com/7.x/avataaars/svg?seed=anon'
  )

  const baseCampanha = computed(() => getBaseCampanha(id.value))
  const contribuicoesExtras = computed(() => getExtra(id.value))
  const totalValor = computed(() => baseCampanha.value.valorNumerico + contribuicoesExtras.value.valorExtra)
  const totalApoiadores = computed(() => baseCampanha.value.apoiadores + contribuicoesExtras.value.apoiadoresExtra)
  const valorArrecadadoFormatado = computed(() => formatarMoeda(totalValor.value))
  const percentualMeta = computed(() => {
    if (totalValor.value <= 0) return jogo.value.metaPercentual
    if (baseCampanha.value.metaNumerico <= 0) return 0

    return Math.min(100, Math.round((totalValor.value / baseCampanha.value.metaNumerico) * 100))
  })

  const fotosDosPosts = computed<FotoPost[]>(() =>
    jogo.value.atualizacoes.flatMap(atualizacao =>
      atualizacao.imagem ? [{ src: atualizacao.imagem, titulo: atualizacao.titulo }] : []
    )
  )
  const {
    itemSelecionado: fotoModal,
    abrir: abrirFotoModal,
    fechar: fecharFotoModal
  } = useModal<FotoPost>()

  return {
    id,
    jogo,
    slugDev,
    comentariosPorAtualizacao,
    totalLikes,
    totalDislikes,
    reacaoAtual,
    reagir,
    getForm,
    enviarComentario,
    isLoggedIn,
    avatarUsuarioAtual,
    totalApoiadores,
    valorArrecadadoFormatado,
    percentualMeta,
    formatarMoeda,
    fotosDosPosts,
    fotoModal,
    abrirFotoModal,
    fecharFotoModal
  }
}
