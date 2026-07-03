// TODO(API): carregar o catálogo público por JogoService em vez de usar app/data/jogos.ts.
import type { Jogo } from '~/types/jogo.interface'
import { jogos as jogosData } from '~/data/jogos'

export type { Jogo }

export function useJogos () {
  const { getJogoById } = useMeusJogos()

  /** Lista de jogos com thumb/descrição centralizados (meus jogos sobrescrevem o catálogo). */
  const allJogos = computed(() =>
    jogosData.map(j => {
      const dev = getJogoById(j.id)
      return {
        ...j,
        thumb: dev?.thumb ?? j.thumb
      }
    })
  )

  const destaqueHero = computed(() =>
    allJogos.value
      .filter(j => j.categorias.includes('destaque-hero'))
      .slice(0, 3)
      .map(j => ({
        id: j.id,
        title: j.title,
        subtitle: j.genero[0] ?? 'Indie',
        image: j.thumb,
        tags: j.genero,
        developer: j.desenvolvedor
      }))
  )

  const jogosDestaque = computed(() =>
    allJogos.value
      .filter(j => j.categorias.includes('destaque'))
      .map(j => ({
        id: j.id,
        title: j.title,
        subtitle: j.genero[0] ?? '',
        image: j.thumb
      }))
  )

  const jogosSobrevivencia = computed(() =>
    allJogos.value
      .filter(j => j.categorias.includes('sobrevivencia'))
      .map(j => ({
        id: j.id,
        title: j.title,
        subtitle: j.genero[0] ?? 'Survival',
        image: j.thumb
      }))
  )

  const jogosRpg = computed(() =>
    allJogos.value
      .filter(j => j.categorias.includes('rpg'))
      .map(j => ({
        id: j.id,
        title: j.title,
        subtitle: j.genero[0] ?? 'RPG',
        image: j.thumb
      }))
  )

  const opcoesFiltros = computed(() => {
    const generos = new Set<string>()
    const desenvolvedores = new Set<string>()
    const jogadores = new Set<string>()
    const sistemas = new Set<string>()
    allJogos.value.forEach(j => {
      j.genero.forEach(g => generos.add(g))
      desenvolvedores.add(j.desenvolvedor)
      jogadores.add(j.qtdeJogadores)
      j.so.forEach(s => sistemas.add(s))
    })
    const metas = [0, 25, 50, 75, 100]
    const anosPostagem = Array.from(new Set(allJogos.value.map(j => j.dataPostagem.slice(0, 4)))).filter(Boolean).sort().reverse()
    return {
      generos: Array.from(generos).sort(),
      desenvolvedores: Array.from(desenvolvedores).sort(),
      jogadores: Array.from(jogadores).sort(),
      sistemas: Array.from(sistemas).sort(),
      metas,
      anosPostagem
    }
  })

  return {
    allJogos,
    destaqueHero,
    jogosDestaque,
    jogosSobrevivencia,
    jogosRpg,
    opcoesFiltros
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
  const { allJogos, opcoesFiltros } = useJogos()

  const jogosFiltrados = computed(() => {
    let list = [...allJogos.value]
    const q = filtros.busca.value.trim().toLowerCase()
    if (q) {
      list = list.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.desenvolvedor.toLowerCase().includes(q) ||
          j.genero.some(g => g.toLowerCase().includes(q))
      )
    }
    if (filtros.generos.value.length) {
      list = list.filter(j => filtros.generos.value.some(g => j.genero.includes(g)))
    }
    if (filtros.desenvolvedor.value) {
      list = list.filter(j => j.desenvolvedor === filtros.desenvolvedor.value)
    }
    if (filtros.metaMin.value != null) {
      list = list.filter(j => j.metaPercentual >= filtros.metaMin.value!)
    }
    if (filtros.dataPostagem.value) {
      list = list.filter(j => j.dataPostagem.startsWith(filtros.dataPostagem.value!))
    }
    if (filtros.qtdeJogadores.value) {
      list = list.filter(j => j.qtdeJogadores === filtros.qtdeJogadores.value)
    }
    if (filtros.compatControle.value === true) {
      list = list.filter(j => j.compatControle)
    }
    if (filtros.so.value.length) {
      list = list.filter(j => filtros.so.value.some(s => j.so.includes(s)))
    }
    return list
  })

  return { jogosFiltrados, opcoesFiltros, allJogos }
}
