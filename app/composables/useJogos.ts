import type { ApiJogo, Jogo } from '~/types/jogo.interface'
import { useJogoService } from '~/services/jogo.service'

export type { Jogo }

function quantidadeJogadores (jogo: ApiJogo): string {
  const minimo = jogo.numJogadoresMin ?? 1
  const maximo = jogo.numJogadoresMax ?? minimo
  return minimo === maximo ? String(minimo) : `${minimo}-${maximo}`
}

export function mapJogoPublico (jogo: ApiJogo): Jogo {
  return {
    id: String(jogo.id),
    apiId: jogo.id,
    title: jogo.titulo,
    descricao: jogo.descricao ?? '',
    thumb: jogo.imgThumb,
    genero: jogo.generos ?? [],
    desenvolvedor: jogo.desenvolvedor || 'Desenvolvedor independente',
    rating: jogo.avaliacao != null ? String(jogo.avaliacao) : '',
    metaPercentual: jogo.metaPercentual ?? 0,
    dataPostagem: jogo.dataInicio?.slice(0, 10) ?? '',
    dataConclusao: jogo.dataConclusao?.slice(0, 10),
    qtdeJogadores: quantidadeJogadores(jogo),
    compatControle: Boolean(jogo.controle),
    so: jogo.plataformas ?? [],
    categorias: jogo.categorias ?? [],
    valorArrecadado: jogo.totalArrecadado ?? 0,
    apoiadores: jogo.apoiadores ?? 0,
    metaValor: jogo.metaFinanceira ?? 0,
    dias: jogo.diasRestantes ?? jogo.campanha ?? 0
  }
}

export function useJogos () {
  const allJogos = useState<Jogo[]>('catalogo-publico-api', () => [])
  const loading = useState('catalogo-publico-loading', () => false)
  const error = useState<string | null>('catalogo-publico-error', () => null)
  const loaded = useState('catalogo-publico-loaded', () => false)
  const jogoService = useJogoService()

  async function refresh (force = false) {
    if (loading.value || (loaded.value && !force)) return
    loading.value = true
    error.value = null
    try {
      const page = await jogoService.listar({ size: 100, sort: 'titulo,asc' })
      allJogos.value = page.content.map(mapJogoPublico)
      loaded.value = true
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Não foi possível carregar os jogos.'
    } finally {
      loading.value = false
    }
  }

  const porCategoria = (categoria: string, genero?: string) => computed(() => {
    const categorizados = allJogos.value.filter(jogo => jogo.categorias.includes(categoria))
    if (categorizados.length) return categorizados
    const porGenero = genero
      ? allJogos.value.filter(jogo => jogo.genero.some(item => item.toLowerCase().includes(genero.toLowerCase())))
      : allJogos.value
    return porGenero.length ? porGenero : allJogos.value
  })

  const toCarousel = (lista: ComputedRef<Jogo[]>) => computed(() => lista.value.map(jogo => ({
    id: jogo.id,
    title: jogo.title,
    subtitle: jogo.genero[0] ?? 'Indie',
    image: jogo.thumb,
    tags: jogo.genero,
    developer: jogo.desenvolvedor
  })))

  const destaqueHero = toCarousel(computed(() => {
    const destaques = allJogos.value.filter(jogo => jogo.categorias.includes('destaque-hero'))
    return (destaques.length ? destaques : allJogos.value).slice(0, 3)
  }))
  const jogosDestaque = toCarousel(porCategoria('destaque'))
  const jogosSobrevivencia = toCarousel(porCategoria('sobrevivencia', 'survival'))
  const jogosRpg = toCarousel(porCategoria('rpg', 'rpg'))

  const opcoesFiltros = computed(() => {
    const generos = new Set<string>()
    const desenvolvedores = new Set<string>()
    const jogadores = new Set<string>()
    const sistemas = new Set<string>()
    allJogos.value.forEach(jogo => {
      jogo.genero.forEach(item => generos.add(item))
      desenvolvedores.add(jogo.desenvolvedor)
      jogadores.add(jogo.qtdeJogadores)
      jogo.so.forEach(item => sistemas.add(item))
    })
    return {
      generos: [...generos].sort(),
      desenvolvedores: [...desenvolvedores].sort(),
      jogadores: [...jogadores].sort(),
      sistemas: [...sistemas].sort(),
      metas: [0, 25, 50, 75, 100],
      anosPostagem: [...new Set(allJogos.value.map(jogo => jogo.dataPostagem.slice(0, 4)))].filter(Boolean).sort().reverse()
    }
  })

  return {
    allJogos, loading, error, loaded, refresh, destaqueHero, jogosDestaque,
    jogosSobrevivencia, jogosRpg, opcoesFiltros
  }
}

export function useJogosFiltrados (filtros: {
  busca: Ref<string>
  generos: Ref<string[]>
  desenvolvedor: Ref<string | null>
  metaMin: Ref<number | null>
  dataPostagem: Ref<string | null>
  qtdeJogadores: Ref<string | null>
  compatControle: Ref<boolean | null>
  so: Ref<string[]>
}) {
  const catalogo = useJogos()
  const jogosFiltrados = computed(() => {
    let lista = [...catalogo.allJogos.value]
    const busca = filtros.busca.value.trim().toLowerCase()
    if (busca) lista = lista.filter(jogo =>
      jogo.title.toLowerCase().includes(busca)
      || jogo.desenvolvedor.toLowerCase().includes(busca)
      || jogo.genero.some(genero => genero.toLowerCase().includes(busca))
    )
    if (filtros.generos.value.length) lista = lista.filter(jogo => filtros.generos.value.some(genero => jogo.genero.includes(genero)))
    if (filtros.desenvolvedor.value) lista = lista.filter(jogo => jogo.desenvolvedor === filtros.desenvolvedor.value)
    if (filtros.metaMin.value != null) lista = lista.filter(jogo => jogo.metaPercentual >= filtros.metaMin.value!)
    if (filtros.dataPostagem.value) lista = lista.filter(jogo => jogo.dataPostagem.startsWith(filtros.dataPostagem.value!))
    if (filtros.qtdeJogadores.value) lista = lista.filter(jogo => jogo.qtdeJogadores === filtros.qtdeJogadores.value)
    if (filtros.compatControle.value) lista = lista.filter(jogo => jogo.compatControle)
    if (filtros.so.value.length) lista = lista.filter(jogo => filtros.so.value.some(sistema => jogo.so.includes(sistema)))
    return lista
  })

  return { ...catalogo, jogosFiltrados }
}
