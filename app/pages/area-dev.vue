<template>
  <div class="min-h-screen bg-dark">
    <div class="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
      <div class="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <!-- Coluna esquerda: perfil estúdio + meus jogos -->
        <aside class="w-full shrink-0 lg:w-80">
          <div class="flex flex-col gap-6">
            <!-- Card do desenvolvedor autenticado -->
            <div class="rounded-xl border border-primary/50 bg-zinc-900/50 p-6">
              <div class="flex items-start gap-4">
                <div class="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-zinc-700">
                  <img :src="avatarEstudio" :alt="`Avatar de ${nomeEstudio}`" class="h-full w-full object-cover">
                </div>
                <div class="min-w-0 flex-1">
                  <h2 class="text-2xl font-bold text-white">
                    {{ nomeEstudio }}
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
                {{ bioEstudio }}
              </p>
              <div class="mt-4 h-px w-full bg-zinc-700" />
              <p class="mt-4 text-sm text-muted">
                Conta de desenvolvedor IndieNE
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
                <li v-if="loading" class="py-5 text-center text-sm text-zinc-400" role="status">Carregando jogos...</li>
                <li v-else-if="error" class="py-4 text-center">
                  <p class="text-sm text-red-400">{{ error }}</p>
                  <button type="button" class="mt-3 text-sm text-primary hover:underline" @click="refreshJogos">Tentar novamente</button>
                </li>
                <li v-else-if="!meusJogos.length" class="py-5 text-center text-sm text-zinc-500">Você ainda não cadastrou jogos.</li>
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
          <p v-if="operacaoErro" class="mb-5 rounded-lg border border-red-900/60 bg-red-950/20 p-4 text-sm text-red-400" role="alert">
            {{ operacaoErro }}
          </p>
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
                <button
                  type="button"
                  class="shrink-0 rounded p-2 text-zinc-400 transition hover:bg-red-950 hover:text-red-400"
                  aria-label="Excluir jogo"
                  @click="confirmarExcluirJogo(jogoAtual)"
                >
                  <span aria-hidden="true">🗑</span>
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
            :nome-estudio="nomeEstudio"
            :saving="salvandoJogo"
            @save="onSalvarJogo"
          />

          <ModalNovoPost
            v-model="modalNovoPostAberto"
            :jogo-id="jogoSelecionado"
            :jogo-title="jogoAtual?.title"
            :saving="salvandoPost"
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
              <p v-if="postsLoading[jogoSelecionado]" class="py-8 text-center text-zinc-400" role="status">Carregando publicações...</p>
              <div v-else-if="postsErrors[jogoSelecionado]" class="py-8 text-center">
                <p class="text-sm text-red-400" role="alert">{{ postsErrors[jogoSelecionado] }}</p>
                <button type="button" class="mt-3 text-sm text-primary hover:underline" @click="refreshPosts(jogoSelecionado)">Tentar novamente</button>
              </div>
              <p v-else-if="!posts.length" class="rounded-lg border border-dashed border-zinc-700 py-8 text-center text-zinc-500">Ainda não há publicações neste jogo.</p>
              <article
                v-for="(post, idx) in posts"
                :key="idx"
                class="rounded-xl border border-primary/50 bg-zinc-900/50 p-6"
              >
                <div class="flex items-start justify-between gap-4">
                  <h3 class="text-lg font-bold text-white">{{ post.titulo }}</h3>
                  <button v-if="post.id" type="button" class="rounded p-2 text-zinc-400 hover:bg-red-950 hover:text-red-400" :aria-label="`Excluir publicação ${post.titulo}`" @click="confirmarExcluirPost(post.id, post.titulo)">
                    <span aria-hidden="true">🗑</span>
                  </button>
                </div>
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
definePageMeta({ layout: 'default', middleware: ['auth', 'developer'] })

import type { JogoDev } from '~/types/jogo-dev.interface'
import { formatarMoeda, parseMetaValor } from '~/utils/moeda'

interface FotoPost {
  src: string
  titulo: string
}

const { meusJogos, loading, error, refresh: refreshJogos, addJogo, updateJogo, removeJogo, getJogoById } = useMeusJogos()
const { getPosts: getPostsDev, loading: postsLoading, errors: postsErrors, refresh: refreshPosts, addPost: addPostDev, removePost } = usePostsDev()
const { getAvatarUrl } = useComentarios()
const { user } = useAuth()
const jogoSelecionado = ref('')
const modalAberto = ref(false)
const modalNovoPostAberto = ref(false)
const jogoParaEditar = ref<JogoDev | null>(null)
const salvandoJogo = ref(false)
const salvandoPost = ref(false)
const operacaoErro = ref('')
const nomeEstudio = computed(() => user.value?.nome || 'Desenvolvedor independente')
const bioEstudio = computed(() => `Projetos publicados por ${nomeEstudio.value} na comunidade IndieNE.`)
const avatarEstudio = computed(() => getAvatarUrl(user.value?.email || nomeEstudio.value))

watch(meusJogos, (lista) => {
  if (!jogoSelecionado.value && lista[0]) jogoSelecionado.value = lista[0].id
}, { immediate: true })
watch(jogoSelecionado, (id) => {
  if (id) refreshPosts(id)
}, { immediate: true })

const jogoAtual = computed(() =>
  jogoSelecionado.value ? getJogoById(jogoSelecionado.value) : undefined
)
const totalValorDisplay = computed(() => parseMetaValor(jogoAtual.value?.valorArrecadado))
const valorArrecadadoDisplay = computed(() => formatarMoeda(totalValorDisplay.value))
const totalApoiadoresDisplay = computed(() => jogoAtual.value?.apoiadores ?? 0)
const metaNumericoDisplay = computed(() =>
  parseMetaValor(jogoAtual.value?.metaValor)
)
const metaFormatada = computed(() =>
  metaNumericoDisplay.value > 0 ? formatarMoeda(metaNumericoDisplay.value) : (jogoAtual.value?.metaValor || '—')
)
const percentualMetaDisplay = computed(() =>
  metaNumericoDisplay.value <= 0
    ? 0
    : Math.min(100, Math.round((totalValorDisplay.value / metaNumericoDisplay.value) * 100))
)
const posts = computed(() => getPostsDev(jogoSelecionado.value))
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
  salvandoJogo.value = true
  operacaoErro.value = ''
  try {
    if ('id' in payload && payload.id) await updateJogo(payload.id, payload)
    else jogoSelecionado.value = (await addJogo(payload)).id
    modalAberto.value = false
  } catch (cause) {
    operacaoErro.value = cause instanceof Error ? cause.message : 'Não foi possível salvar o jogo.'
  } finally {
    salvandoJogo.value = false
  }
}

function formatarDataAgora () {
  const data = new Date()
  return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} às ${data.getHours().toString().padStart(2, '0')}h${data.getMinutes().toString().padStart(2, '0')}`
}

async function onNovoPost (payload: { titulo: string, descricao: string, imagem?: string }) {
  if (!jogoSelecionado.value) return
  salvandoPost.value = true
  operacaoErro.value = ''
  try {
    await addPostDev(jogoSelecionado.value, { ...payload, data: formatarDataAgora() })
    modalNovoPostAberto.value = false
  } catch (cause) {
    operacaoErro.value = cause instanceof Error ? cause.message : 'Não foi possível publicar a atualização.'
  } finally {
    salvandoPost.value = false
  }
}

async function confirmarExcluirJogo (jogo: JogoDev) {
  if (!window.confirm(`Excluir definitivamente o jogo “${jogo.title}”? Esta ação não pode ser desfeita.`)) return
  operacaoErro.value = ''
  try {
    await removeJogo(jogo.id)
    jogoSelecionado.value = meusJogos.value[0]?.id ?? ''
  } catch (cause) {
    operacaoErro.value = cause instanceof Error ? cause.message : 'Não foi possível excluir o jogo.'
  }
}

async function confirmarExcluirPost (postagemId: number, titulo: string) {
  if (!window.confirm(`Excluir definitivamente a publicação “${titulo}”?`)) return
  operacaoErro.value = ''
  try {
    await removePost(jogoSelecionado.value, postagemId)
  } catch (cause) {
    operacaoErro.value = cause instanceof Error ? cause.message : 'Não foi possível excluir a publicação.'
  }
}

await refreshJogos()
</script>


<style scoped src="../assets/css/pages/area-dev.css"></style>
