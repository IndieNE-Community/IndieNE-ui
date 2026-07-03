<template>
  <div class="min-h-screen bg-dark">
    <div class="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
      <div class="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <!-- Coluna esquerda: perfil estúdio + meus jogos -->
        <aside class="w-full shrink-0 lg:w-80">
          <div class="flex flex-col gap-6">
            <!-- Card estúdio Supergiant Games -->
            <div class="rounded-xl border border-primary/50 bg-zinc-900/50 p-6">
              <div class="flex items-start gap-4">
                <div class="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-zinc-700">
                  <img
                    src="/images/supergiantgames.jpg"
                    alt="Supergiant Games"
                    class="h-full w-full object-cover"
                  >
                </div>
                <div class="min-w-0 flex-1">
                  <h2 class="text-2xl font-bold text-white">
                    Supergiant Games
                  </h2>
                  <p class="mt-1 text-sm text-muted">
                    Pequeno estúdio indie
                  </p>
                </div>
              </div>
              <p class="mt-4 text-sm font-medium uppercase tracking-wider text-white">
                Bio
              </p>
              <p class="mt-2 text-sm leading-relaxed text-white">
                Somos um estúdio de jogos indie focado em experiências únicas.
              </p>
              <div class="mt-4 h-px w-full bg-zinc-700" />
              <p class="mt-4 text-sm text-muted">
                Membro desde 2019
              </p>
              <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-700">
                <div class="h-full rounded-full bg-primary" :style="{ width: '60%' }" />
              </div>
            </div>

            <!-- Meus jogos -->
            <div class="rounded-xl border border-primary/50 bg-zinc-900/50 p-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-white">
                  Meus jogos
                </h3>
                <button
                  type="button"
                  class="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-dark transition hover:bg-primary/90"
                  @click="abrirModalCriar()"
                >
                  Novo jogo
                </button>
              </div>
              <ul class="mt-4 flex flex-col gap-2">
                <li
                  v-for="item in meusJogos"
                  :key="item.id"
                >
                  <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition"
                    :class="jogoSelecionado === item.id ? 'bg-primary/20 text-white' : 'text-white hover:bg-zinc-800'"
                    @click="jogoSelecionado = item.id"
                  >
                    <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-700">
                      <img
                        v-if="item.thumb"
                        :src="item.thumb"
                        :alt="item.title"
                        class="h-full w-full object-cover"
                      >
                      <div
                        v-else
                        class="flex h-full w-full items-center justify-center text-lg font-bold text-zinc-500"
                      >
                        {{ (item.title || '?').charAt(0).toUpperCase() }}
                      </div>
                    </div>
                    <span class="min-w-0 flex-1 truncate text-sm font-medium">
                      {{ item.title }}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <!-- Coluna direita: jogo selecionado (dashboard) + crowdfunding + posts -->
        <div class="min-w-0 flex-1">
          <template v-if="jogoAtual">
            <!-- Card do jogo selecionado -->
            <div class="rounded-xl border border-primary/50 bg-zinc-900/50 overflow-hidden">
              <!-- Foto principal (mesma do restante do sistema) -->
              <div class="aspect-video w-full bg-zinc-800">
                <img
                  v-if="jogoAtual.thumb"
                  :src="jogoAtual.thumb"
                  :alt="jogoAtual.title"
                  class="h-full w-full object-cover"
                >
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center text-zinc-500 text-lg font-medium"
                >
                  {{ jogoAtual.title }}
                </div>
              </div>
              <div class="p-6">
              <div class="flex items-start justify-between gap-4">
                <h1 class="text-3xl font-bold text-white">
                  {{ jogoAtual.title }}
                </h1>
                <button
                  type="button"
                  class="shrink-0 rounded p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  aria-label="Editar jogo"
                  @click="abrirModalEditar(jogoAtual)"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in jogoAtual.genero"
                  :key="tag"
                  class="rounded-full border border-primary/50 bg-transparent px-3 py-1 text-sm text-white"
                >
                  {{ tag }}
                </span>
              </div>
              <p class="mt-4 text-sm font-medium uppercase tracking-wider text-white">
                Bio
              </p>
              <p class="mt-2 text-sm leading-relaxed text-white">
                {{ jogoAtual.descricao || 'Sem descrição.' }}
              </p>
              <p class="mt-4 text-sm text-white">
                Fotos
              </p>
              <p class="mt-1 text-xs text-zinc-500">
                Fotos dos posts (clique para ampliar)
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                <template v-if="fotosDosPosts.length">
                  <button
                    v-for="(foto, i) in fotosDosPosts"
                    :key="i"
                    type="button"
                    class="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-700 transition hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    @click="abrirFotoModal(foto)"
                  >
                    <img :src="foto.src" :alt="foto.titulo" class="h-full w-full object-cover">
                  </button>
                </template>
                <div v-else class="rounded-lg border border-dashed border-zinc-600 px-4 py-3 text-sm text-muted">
                  Nenhuma foto nos posts deste jogo.
                </div>
              </div>

              <!-- Crowdfunding (resumo) – valor, apoiadores e % calculados pelas contribuições -->
              <div class="mt-8 border-t border-zinc-700 pt-6">
                <p class="text-3xl font-bold text-white">
                  {{ valorArrecadadoDisplay }}
                </p>
                <p class="mt-2 text-sm text-white">
                  apoiado por {{ totalApoiadoresDisplay }} pessoas em {{ jogoAtual.dias }} dias
                </p>
                <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-700">
                  <div
                    class="h-full rounded-full bg-primary transition-all"
                    :style="{ width: Math.min(100, percentualMetaDisplay) + '%' }"
                  />
                </div>
                <p class="mt-2 text-sm font-medium text-white">
                  {{ percentualMetaDisplay }}%
                </p>
                <p class="mt-1 text-sm text-white">
                  Meta {{ metaFormatada }}
                </p>
              </div>
              </div>
            </div>
          </template>
          <div v-else class="rounded-xl border border-primary/50 bg-zinc-900/50 p-8 text-center text-white">
            <p>Selecione um jogo na lista ou crie um novo.</p>
          </div>

          <!-- Modal criar/editar jogo -->
          <ModalJogoForm
            v-model="modalAberto"
            :jogo="jogoParaEditar"
            nome-estudio="Supergiant Games"
            @save="onSalvarJogo"
          />

          <ModalNovoPost
            v-model="modalNovoPostAberto"
            :jogo-id="jogoSelecionado"
            :jogo-title="jogoAtual?.title"
            @post="onNovoPost"
          />

          <!-- Modal foto em destaque -->
          <Teleport to="body">
            <Transition name="fade">
              <div
                v-if="fotoModal"
                class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
                role="dialog"
                aria-modal="true"
                aria-label="Visualizar foto"
                @click.self="fecharFotoModal"
              >
                <button
                  type="button"
                  class="absolute right-4 top-4 rounded-full bg-zinc-800 p-2 text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Fechar"
                  @click="fecharFotoModal"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div class="relative max-h-[90vh] max-w-4xl">
                  <img
                    :src="fotoModal.src"
                    :alt="fotoModal.titulo"
                    class="max-h-[90vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                    @click.stop
                  >
                  <p v-if="fotoModal.titulo" class="mt-3 text-center text-sm text-white">
                    {{ fotoModal.titulo }}
                  </p>
                </div>
              </div>
            </Transition>
          </Teleport>

          <!-- Posts -->
          <div class="mt-10 border-t border-zinc-700 pt-8">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-white">
                Posts
              </h2>
              <button
                v-if="jogoAtual"
                type="button"
                class="rounded-full bg-primary px-4 py-2 text-sm font-bold text-dark transition hover:bg-primary/90"
                @click="modalNovoPostAberto = true"
              >
                Novo post
              </button>
            </div>
            <div class="mt-6 flex flex-col gap-6">
              <article
                v-for="(post, idx) in posts"
                :key="idx"
                class="rounded-xl border border-primary/50 bg-zinc-900/50 p-6"
              >
                <h3 class="text-lg font-bold text-white">
                  {{ post.titulo }}
                </h3>
                <p class="mt-2 text-sm text-zinc-400">
                  {{ post.data }}
                </p>
                <div class="mt-4 overflow-hidden rounded-lg bg-zinc-800">
                  <div class="aspect-video w-full">
                    <img
                      v-if="post.imagem"
                      :src="post.imagem"
                      :alt="post.titulo"
                      class="h-full w-full object-cover"
                    >
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center text-zinc-500 text-sm"
                    >
                      Imagem
                    </div>
                  </div>
                </div>
                <p class="mt-4 text-sm leading-relaxed text-white">
                  {{ post.descricao }}
                </p>
                <div class="mt-6 space-y-4 border-t border-zinc-700 pt-4">
                  <div
                    v-for="(comentario, cIdx) in post.comentarios"
                    :key="cIdx"
                    class="flex gap-3"
                  >
                    <img
                      :src="getAvatarUrl(comentario.usuario)"
                      :alt="comentario.usuario"
                      class="h-10 w-10 shrink-0 rounded-full object-cover"
                    >
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-muted">
                        {{ comentario.usuario }}
                      </p>
                      <p class="mt-1 text-sm text-white">
                        {{ comentario.texto }}
                      </p>
                      <div class="mt-2 flex items-center gap-4 text-xs text-zinc-500">
                        <span>{{ comentario.likes }} likes</span>
                        <span>{{ comentario.dislikes }} dislikes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

// TODO(API): substituir campanha e atualizações de app/data/jogo-detalhes.ts por dados do backend.

import type { JogoDev } from '~/types/jogo-dev.interface'
import { getDetalhesJogo } from '~/data/jogo-detalhes'
import { getBaseCampanha } from '~/utils/campanha'
import { formatarMoeda, parseMetaValor } from '~/utils/moeda'

interface FotoPost {
  src: string
  titulo: string
}

const { meusJogos, refresh: refreshJogos, addJogo, updateJogo, getJogoById } = useMeusJogos()
const { getExtra } = useContribuicoes()
const { getPosts: getPostsDev, refresh: refreshPosts, addPost: addPostDev } = usePostsDev()
const { getAvatarUrl } = useComentarios()
const jogoSelecionado = ref('')
const modalAberto = ref(false)
const modalNovoPostAberto = ref(false)
const jogoParaEditar = ref<JogoDev | null>(null)

watch(meusJogos, (lista) => {
  if (!jogoSelecionado.value && lista[0]) jogoSelecionado.value = lista[0].id
}, { immediate: true })
watch(jogoSelecionado, (id) => {
  if (id) refreshPosts(id)
}, { immediate: true })

const jogoAtual = computed(() =>
  jogoSelecionado.value ? getJogoById(jogoSelecionado.value) : undefined
)
const baseCampanha = computed(() =>
  jogoSelecionado.value
    ? getBaseCampanha(jogoSelecionado.value)
    : { valorNumerico: 0, apoiadores: 0, metaNumerico: 0 }
)
const contribuicoesJogo = computed(() =>
  jogoSelecionado.value
    ? getExtra(jogoSelecionado.value)
    : { valorExtra: 0, apoiadoresExtra: 0 }
)
const totalValorDisplay = computed(() => baseCampanha.value.valorNumerico + contribuicoesJogo.value.valorExtra)
const valorArrecadadoDisplay = computed(() => formatarMoeda(totalValorDisplay.value))
const totalApoiadoresDisplay = computed(() => baseCampanha.value.apoiadores + contribuicoesJogo.value.apoiadoresExtra)
const metaNumericoDisplay = computed(() =>
  baseCampanha.value.metaNumerico || parseMetaValor(jogoAtual.value?.metaValor)
)
const metaFormatada = computed(() =>
  metaNumericoDisplay.value > 0 ? formatarMoeda(metaNumericoDisplay.value) : (jogoAtual.value?.metaValor || '—')
)
const percentualMetaDisplay = computed(() =>
  metaNumericoDisplay.value <= 0
    ? 0
    : Math.min(100, Math.round((totalValorDisplay.value / metaNumericoDisplay.value) * 100))
)
const posts = computed(() => [
  ...getPostsDev(jogoSelecionado.value),
  ...getDetalhesJogo(jogoSelecionado.value).atualizacoes
])
const fotosDosPosts = computed<FotoPost[]>(() =>
  posts.value.flatMap(post => post.imagem ? [{ src: post.imagem, titulo: post.titulo }] : [])
)
const {
  itemSelecionado: fotoModal,
  abrir: abrirFotoModal,
  fechar: fecharFotoModal
} = useModal<FotoPost>()

function abrirModalCriar () {
  jogoParaEditar.value = null
  modalAberto.value = true
}

function abrirModalEditar (jogo: JogoDev) {
  jogoParaEditar.value = jogo
  modalAberto.value = true
}

async function onSalvarJogo (payload: JogoDev | Omit<JogoDev, 'id'>) {
  if ('id' in payload && payload.id) await updateJogo(payload.id, payload)
  else jogoSelecionado.value = (await addJogo(payload)).id
}

function formatarDataAgora () {
  const data = new Date()
  return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} às ${data.getHours().toString().padStart(2, '0')}h${data.getMinutes().toString().padStart(2, '0')}`
}

async function onNovoPost (payload: { titulo: string, descricao: string, imagem?: string }) {
  if (!jogoSelecionado.value) return
  await addPostDev(jogoSelecionado.value, { ...payload, data: formatarDataAgora() })
}

await refreshJogos()
</script>


<style scoped src="../assets/css/pages/area-dev.css"></style>
