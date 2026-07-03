import type { ApiJogo } from '~/types/jogo.interface'
import type { JogoDev } from '~/types/jogo-dev.interface'
import { jogoDevVazio } from '~/types/jogo-dev.interface'
import { useJogoService } from '~/services/jogo.service'

function numeroMoeda (valor: string): number {
  return Number(valor.replace(/[^0-9,.-]/g, '').replace('.', '').replace(',', '.')) || 0
}

function mapJogo (jogo: ApiJogo, desenvolvedor: string): JogoDev {
  return {
    id: String(jogo.id), apiId: jogo.id, title: jogo.titulo, descricao: jogo.descricao || '',
    thumb: jogo.imgThumb || '', fotos: [], genero: jogo.genero ? [jogo.genero] : [], desenvolvedor,
    metaPercentual: 0, valorArrecadado: 'R$ 0', metaValor: `R$ ${jogo.metaFinanceira || 0}`,
    apoiadores: 0, dias: 0, dataPostagem: jogo.dataInicio?.slice(0, 7) || '',
    dataConclusao: jogo.dataConclusao?.slice(0, 7) || '', qtdeJogadores: String(jogo.numJogadores || 1),
    compatControle: Boolean(jogo.controle), so: []
  }
}

function toRequest (jogo: Omit<JogoDev, 'id'> | JogoDev) {
  return {
    titulo: jogo.title, descricao: jogo.descricao, metaFinanceira: numeroMoeda(jogo.metaValor), campanha: null,
    dataInicio: jogo.dataPostagem ? `${jogo.dataPostagem.slice(0, 7)}-01` : null,
    dataConclusao: jogo.dataConclusao ? `${jogo.dataConclusao.slice(0, 7)}-01` : null,
    numJogadores: Number(jogo.qtdeJogadores.match(/\d+/)?.[0] || 1), genero: jogo.genero[0] || null,
    controle: jogo.compatControle, imgThumb: jogo.thumb && !jogo.thumb.startsWith('data:') ? jogo.thumb : null
  }
}

export function useMeusJogos () {
  const meusJogos = useState<JogoDev[]>('meus-jogos-api', () => [])
  const loading = useState('meus-jogos-loading', () => false)
  const error = useState<string | null>('meus-jogos-error', () => null)
  const jogoService = useJogoService()
  const { user } = useAuth()

  async function refresh () {
    if (!user.value) return
    loading.value = true
    error.value = null
    try {
      const page = await jogoService.listar({ size: 100, sort: 'titulo,asc' })
      meusJogos.value = page.content
        .filter(jogo => jogo.usuarioId === user.value?.id)
        .map(jogo => mapJogo(jogo, user.value!.nome))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar jogos.'
    } finally {
      loading.value = false
    }
  }

  async function addJogo (payload: Omit<JogoDev, 'id'>) {
    const created = await jogoService.criar(toRequest(payload))
    const jogo = mapJogo(created, user.value?.nome || payload.desenvolvedor)
    meusJogos.value.push(jogo)
    return jogo
  }

  async function updateJogo (id: string, payload: Partial<JogoDev>) {
    const atual = meusJogos.value.find(jogo => jogo.id === id)
    if (!atual?.apiId) return
    const updated = await jogoService.atualizar(atual.apiId, toRequest({ ...atual, ...payload }))
    Object.assign(atual, mapJogo(updated, user.value?.nome || atual.desenvolvedor))
  }

  async function removeJogo (id: string) {
    const atual = meusJogos.value.find(jogo => jogo.id === id)
    if (!atual?.apiId) return
    await jogoService.remover(atual.apiId)
    meusJogos.value = meusJogos.value.filter(jogo => jogo.id !== id)
  }

  function getJogoById (id: string) { return meusJogos.value.find(jogo => jogo.id === id) }

  return { meusJogos, loading, error, refresh, addJogo, updateJogo, removeJogo, getJogoById, jogoDevVazio }
}
