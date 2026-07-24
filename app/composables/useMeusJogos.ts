import type { ApiJogo } from '~/types/jogo.interface'
import type { JogoDev } from '~/types/jogo-dev.interface'
import { jogoDevVazio } from '~/types/jogo-dev.interface'
import { useJogoService } from '~/services/jogo.service'
import { useImagemService } from '~/services/imagem.service'

function numeroMoeda (valor: string): number {
  return Number(valor.replace(/[^0-9,.-]/g, '').replace('.', '').replace(',', '.')) || 0
}

function quantidadeJogadores (jogo: ApiJogo): string {
  const minimo = jogo.numJogadoresMin ?? 1
  const maximo = jogo.numJogadoresMax ?? minimo
  return minimo === maximo ? String(minimo) : `${minimo}-${maximo}`
}

function mapJogo (jogo: ApiJogo, desenvolvedor: string, imagens: string[] = []): JogoDev {
  const thumb = jogo.imgThumb || imagens[0] || ''
  return {
    id: String(jogo.id), apiId: jogo.id, title: jogo.titulo, descricao: jogo.descricao || '',
    thumb, fotos: imagens.filter(imagem => imagem !== thumb), genero: jogo.generos ?? [],
    categorias: jogo.categorias ?? [],
    desenvolvedor: jogo.desenvolvedor || desenvolvedor,
    metaPercentual: jogo.metaPercentual ?? 0, valorArrecadado: `R$ ${jogo.totalArrecadado ?? 0}`,
    metaValor: `R$ ${jogo.metaFinanceira || 0}`, apoiadores: jogo.apoiadores ?? 0,
    dias: jogo.diasRestantes ?? jogo.campanha ?? 0, dataPostagem: jogo.dataInicio?.slice(0, 7) || '',
    dataConclusao: jogo.dataConclusao?.slice(0, 7) || '', qtdeJogadores: quantidadeJogadores(jogo),
    compatControle: Boolean(jogo.controle), so: jogo.plataformas ?? []
  }
}

function intervaloJogadores (valor: string): [number, number] {
  const numeros = valor.match(/\d+/g)?.map(Number) ?? [1]
  return [numeros[0] || 1, numeros[1] || numeros[0] || 1]
}

function toRequest (jogo: Omit<JogoDev, 'id'> | JogoDev) {
  const [numJogadoresMin, numJogadoresMax] = intervaloJogadores(jogo.qtdeJogadores)
  return {
    titulo: jogo.title, descricao: jogo.descricao, metaFinanceira: numeroMoeda(jogo.metaValor) || null,
    campanha: jogo.dias,
    dataInicio: jogo.dataPostagem ? `${jogo.dataPostagem.slice(0, 7)}-01` : null,
    dataConclusao: jogo.dataConclusao ? `${jogo.dataConclusao.slice(0, 7)}-01` : null,
    numJogadoresMin, numJogadoresMax, generos: jogo.genero, categorias: jogo.categorias ?? [], plataformas: jogo.so,
    controle: jogo.compatControle, imgThumb: jogo.thumb && !jogo.thumb.startsWith('data:') ? jogo.thumb : null
  }
}

function validarImagens (imagens: string[]) {
  const indiceDataUrl = imagens.findIndex(imagem => imagem.startsWith('data:'))
  if (indiceDataUrl >= 0) {
    throw new Error(`A imagem ${indiceDataUrl + 1} é um arquivo local. Use uma URL pública enquanto o upload não for suportado pela API.`)
  }
}

export function useMeusJogos () {
  const meusJogos = useState<JogoDev[]>('meus-jogos-api', () => [])
  const loading = useState('meus-jogos-loading', () => false)
  const error = useState<string | null>('meus-jogos-error', () => null)
  const jogoService = useJogoService()
  const imagemService = useImagemService()
  const { user } = useAuth()

  async function refresh () {
    if (!user.value) return
    loading.value = true
    error.value = null
    try {
      // TODO(API): trocar pela consulta de jogos do usuário autenticado quando houver filtro por usuarioId ou /usuarios/me/jogos.
      const page = await jogoService.listar({ size: 100, sort: 'titulo,asc' })
      meusJogos.value = await Promise.all(page.content
        .filter(jogo => jogo.usuarioId === user.value?.id)
        .map(async (jogo) => {
          const imagens = await imagemService.listar({ jogoId: jogo.id })
          return mapJogo(jogo, user.value!.nome, imagens.map(item => item.imagem))
        }))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar jogos.'
    } finally {
      loading.value = false
    }
  }

  async function addJogo (payload: Omit<JogoDev, 'id'>) {
    const imagensPayload = [payload.thumb, ...payload.fotos].filter((imagem): imagem is string => Boolean(imagem))
    validarImagens(imagensPayload)
    const created = await jogoService.criar(toRequest(payload))
    const galeria = imagensPayload.filter(imagem => imagem !== created.imgThumb)
    const criadas: number[] = []
    try {
      for (let indice = 0; indice < galeria.length; indice++) {
        try {
          criadas.push((await imagemService.criar({ jogoId: created.id, imagem: galeria[indice]! })).id)
        } catch {
          throw new Error(`O jogo não foi criado porque a imagem ${indice + 1} não pôde ser salva.`)
        }
      }
    } catch (cause) {
      await Promise.allSettled(criadas.map(id => imagemService.remover(id)))
      await jogoService.remover(created.id).catch(() => undefined)
      throw cause
    }
    const jogo = mapJogo(created, user.value?.nome || payload.desenvolvedor, galeria)
    meusJogos.value.push(jogo)
    return jogo
  }

  async function updateJogo (id: string, payload: Partial<JogoDev>) {
    const atual = meusJogos.value.find(jogo => jogo.id === id)
    if (!atual?.apiId) return
    const dados = { ...atual, ...payload }
    const imagensPayload = [dados.thumb, ...dados.fotos].filter((imagem): imagem is string => Boolean(imagem))
    validarImagens(imagensPayload)
    const updated = await jogoService.atualizar(atual.apiId, toRequest({ ...atual, ...payload }))
    const imagensAtuais = await imagemService.listar({ jogoId: atual.apiId })
    const galeria = imagensPayload.filter(imagem => imagem !== updated.imgThumb)
    const existentes = new Map(imagensAtuais.map(imagem => [imagem.imagem, imagem]))
    const novas = galeria.filter(imagem => !existentes.has(imagem))
    const obsoletas = imagensAtuais.filter(imagem => !galeria.includes(imagem.imagem))
    const criadas: number[] = []
    try {
      for (const [indice, imagem] of novas.entries()) {
        try {
          criadas.push((await imagemService.criar({ jogoId: atual.apiId, imagem })).id)
        } catch {
          throw new Error(`Os dados do jogo foram atualizados, mas a nova imagem ${indice + 1} falhou. As imagens anteriores foram preservadas.`)
        }
      }
      await Promise.all(obsoletas.map(imagem => imagemService.remover(imagem.id)))
    } catch (cause) {
      await Promise.allSettled(criadas.map(imagemId => imagemService.remover(imagemId)))
      throw cause
    }
    Object.assign(atual, mapJogo(updated, user.value?.nome || atual.desenvolvedor, galeria))
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
