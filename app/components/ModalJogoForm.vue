<template>
  <Teleport to="body">
    <div
      v-show="modelValue"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      @click.self="emit('update:modelValue', false)"
    >
      <div
        ref="dialogRef"
        class="max-h-[90vh] w-full overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl sm:max-w-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabindex="-1"
      >
        <div class="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-700 bg-zinc-900 px-6 py-4">
          <h2 id="modal-title" class="text-xl font-bold text-white">
            {{ isEdit ? 'Editar jogo' : 'Novo jogo' }}
          </h2>
          <button
            type="button"
            class="rounded p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Fechar"
            @click="emit('update:modelValue', false)"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form class="space-y-6 p-6" @submit.prevent="onSubmit">
          <div class="grid gap-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="jogo-titulo" class="block text-sm font-medium text-white">Título</label>
              <input
                id="jogo-titulo"
                v-model="form.title"
                type="text"
                required
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Nome do jogo"
              >
            </div>
            <div class="sm:col-span-2">
              <label for="jogo-descricao" class="block text-sm font-medium text-white">Descrição (Bio)</label>
              <textarea
                id="jogo-descricao"
                v-model="form.descricao"
                rows="3"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Descreva o jogo..."
              />
            </div>
            <div>
              <label for="jogo-meta" class="block text-sm font-medium text-white">Meta de arrecadação</label>
              <input
                id="jogo-meta"
                v-model="form.metaValor"
                type="text"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="R$ 100.000"
              >
              <p class="mt-1 text-xs text-zinc-500">
                Valor arrecadado, apoiadores e % da meta são calculados automaticamente pelas contribuições.
              </p>
            </div>
            <div>
              <label for="jogo-dias" class="block text-sm font-medium text-white">Dias (campanha)</label>
              <input
                id="jogo-dias"
                v-model.number="form.dias"
                type="number"
                min="0"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
              >
            </div>
            <div>
              <label for="jogo-data-postagem" class="block text-sm font-medium text-white">Data de início</label>
              <input
                id="jogo-data-postagem"
                v-model="form.dataPostagem"
                type="month"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
              >
            </div>
            <div>
              <label for="jogo-data-conclusao" class="block text-sm font-medium text-white">Data de conclusão</label>
              <input
                id="jogo-data-conclusao"
                v-model="form.dataConclusao"
                type="month"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="2025-06 ou vazio"
              >
            </div>
            <div>
              <label for="jogo-jogadores" class="block text-sm font-medium text-white">Quantidade de jogadores</label>
              <input
                id="jogo-jogadores"
                v-model="form.qtdeJogadores"
                type="text"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="1-4"
              >
            </div>
            <div class="flex items-center gap-2 pt-8">
              <input
                v-model="form.compatControle"
                id="compat-controle"
                type="checkbox"
                class="rounded border-zinc-600 bg-surface text-primary focus:ring-primary"
              >
              <label for="compat-controle" class="text-sm text-white">Compatível com controle</label>
            </div>
            <div class="sm:col-span-2">
              <label for="jogo-generos" class="block text-sm font-medium text-white">Gêneros (separados por vírgula)</label>
              <input
                id="jogo-generos"
                v-model="generoTexto"
                type="text"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Roguelike, Ação, Multijogador"
              >
            </div>
            <fieldset class="sm:col-span-2">
              <legend class="block text-sm font-medium text-white">Categorias de exibição</legend>
              <p class="mt-1 text-xs text-zinc-500">Definem em quais seções da página inicial o jogo poderá aparecer.</p>
              <div class="mt-3 grid gap-3 sm:grid-cols-2">
                <label v-for="categoria in categoriasDisponiveis" :key="categoria.value" class="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-white">
                  <input v-model="form.categorias" type="checkbox" :value="categoria.value" class="rounded border-zinc-600 bg-surface text-primary focus:ring-primary">
                  {{ categoria.label }}
                </label>
              </div>
            </fieldset>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-white">Plataformas (SO)</label>
              <div class="mt-2 flex flex-wrap gap-4">
                <label v-for="s in ['Windows', 'Mac', 'Linux']" :key="s" class="flex items-center gap-2 text-sm text-white">
                  <input
                    v-model="form.so"
                    type="checkbox"
                    :value="s"
                    class="rounded border-zinc-600 bg-surface text-primary focus:ring-primary"
                  >
                  {{ s }}
                </label>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label for="jogo-thumb-url" class="block text-sm font-medium text-white">Imagem principal (thumb/hero)</label>
              <div class="mt-2 flex flex-wrap items-start gap-4">
                <div
                  v-if="form.thumb"
                  class="relative shrink-0"
                >
                  <img
                    :src="form.thumb"
                    alt="Thumb"
                    class="h-24 w-32 rounded-lg border border-zinc-700 object-cover"
                  >
                  <button
                    type="button"
                    class="absolute -right-2 -top-2 rounded-full bg-zinc-800 p-1 text-zinc-400 hover:bg-red-600 hover:text-white"
                    aria-label="Remover"
                    @click="form.thumb = ''"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div class="flex flex-col gap-2">
                  <input
                    ref="thumbInputRef"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onThumbChange"
                  >
                  <button
                    type="button"
                    class="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
                    @click="thumbInputRef?.click()"
                  >
                    {{ form.thumb ? 'Trocar imagem' : 'Enviar imagem' }}
                  </button>
                  <span class="text-xs text-zinc-500">ou cole URL:</span>
                  <input
                    id="jogo-thumb-url"
                    v-model="form.thumb"
                    type="url"
                    class="w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    placeholder="https://..."
                  >
                </div>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-white">Fotos (upload ou URL)</label>
              <div class="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id="jogo-foto-url"
                  v-model="fotoUrl"
                  type="url"
                  class="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  placeholder="https://exemplo.com/imagem.jpg"
                  aria-describedby="jogo-foto-url-ajuda jogo-foto-url-erro"
                  @keydown.enter.prevent="adicionarFotoUrl"
                >
                <button
                  type="button"
                  class="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
                  @click="adicionarFotoUrl"
                >
                  Adicionar URL
                </button>
              </div>
              <p v-if="fotoUrlErro" id="jogo-foto-url-erro" class="mt-1 text-sm text-red-400" role="alert">
                {{ fotoUrlErro }}
              </p>
              <input
                ref="fotosInputRef"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="onFotosChange"
              >
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-600 text-zinc-500 transition hover:border-primary hover:text-primary"
                  aria-label="Selecionar fotos locais para prévia"
                  @click="fotosInputRef?.click()"
                >
                  <span class="text-2xl">+</span>
                  <span class="text-[10px]">Prévia local</span>
                </button>
                <div
                  v-for="(src, i) in form.fotos"
                  :key="i"
                  class="relative shrink-0"
                >
                  <img
                    :src="src"
                    :alt="`Foto ${i + 1}`"
                    class="h-20 w-20 rounded-lg border border-zinc-700 object-cover"
                  >
                  <button
                    type="button"
                    class="absolute -right-1 -top-1 rounded-full bg-zinc-800 p-0.5 text-zinc-400 hover:bg-red-600 hover:text-white"
                    aria-label="Remover foto"
                    @click="removerFoto(i)"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <p id="jogo-foto-url-ajuda" class="mt-2 text-xs text-zinc-500">
                Use URLs públicas. O upload de arquivos é apenas uma prévia e não pode ser salvo até a API oferecer upload próprio.
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-zinc-700 pt-6">
            <button
              type="button"
              class="rounded-lg border border-zinc-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
              @click="emit('update:modelValue', false)"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-dark transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ saving ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar jogo' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { JogoDev } from '~/types/jogo-dev.interface'
import { jogoDevVazio } from '~/types/jogo-dev.interface'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    jogo: JogoDev | null
    nomeEstudio?: string
    saving?: boolean
  }>(),
  { nomeEstudio: '', saving: false }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [payload: JogoDev | Omit<JogoDev, 'id'>]
}>()

const isEdit = computed(() => !!props.jogo)

/** Texto livre para gêneros (vírgulas não são removidas enquanto digita) */
const generoTexto = ref('')
const categoriasDisponiveis = [
  { value: 'destaque-hero', label: 'Destaque principal' },
  { value: 'destaque', label: 'Destaques' },
  { value: 'sobrevivencia', label: 'Sobrevivência' },
  { value: 'rpg', label: 'RPG' }
]
const thumbInputRef = ref<HTMLInputElement | null>(null)
const fotosInputRef = ref<HTMLInputElement | null>(null)
const fotoUrl = ref('')
const fotoUrlErro = ref('')
const dialogRef = ref<HTMLElement | null>(null)
useDialogFocus(toRef(props, 'modelValue'), dialogRef)

/** TODO(API): substituir Data URL por upload quando o backend aceitar arquivo ou armazenamento externo. */
function readImageAsDataUrl (file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const w = img.naturalWidth
      const h = img.naturalHeight
      let width = w
      let height = h
      if (w > maxWidth || h > maxWidth) {
        if (w >= h) {
          width = maxWidth
          height = Math.round((h * maxWidth) / w)
        } else {
          height = maxWidth
          width = Math.round((w * maxWidth) / h)
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas not supported'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      } catch {
        reject(new Error('toDataURL failed'))
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image load failed'))
    }
    img.src = url
  })
}

async function onThumbChange (e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file?.type.startsWith('image/')) return
  try {
    form.thumb = await readImageAsDataUrl(file)
  } catch {
    // fallback: ler sem redimensionar (pode ficar grande)
    const reader = new FileReader()
    reader.onload = () => { form.thumb = reader.result as string }
    reader.readAsDataURL(file)
  }
  input.value = ''
}

async function onFotosChange (e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return
  for (const file of Array.from(files)) {
    if (!file.type.startsWith('image/')) continue
    try {
      const dataUrl = await readImageAsDataUrl(file, 1000, 0.78)
      form.fotos.push(dataUrl)
    } catch {
      const reader = new FileReader()
      reader.onload = () => { form.fotos.push(reader.result as string) }
      reader.readAsDataURL(file)
    }
  }
  input.value = ''
}

function removerFoto (index: number) {
  form.fotos.splice(index, 1)
}

function adicionarFotoUrl () {
  const valor = fotoUrl.value.trim()
  fotoUrlErro.value = ''

  if (!valor) {
    fotoUrlErro.value = 'Informe uma URL pública.'
    return
  }

  try {
    const url = new URL(valor)
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Protocolo inválido')
  } catch {
    fotoUrlErro.value = 'Informe uma URL válida iniciada por http:// ou https://.'
    return
  }

  if (form.fotos.includes(valor)) {
    fotoUrlErro.value = 'Esta foto já foi adicionada.'
    return
  }

  form.fotos.push(valor)
  fotoUrl.value = ''
}

const form = reactive({
  title: '',
  descricao: '',
  thumb: '',
  fotos: [] as string[],
  genero: [] as string[],
  categorias: [] as string[],
  desenvolvedor: 'To The Sky',
  metaPercentual: 0,
  valorArrecadado: '',
  metaValor: '',
  apoiadores: 0,
  dias: 0,
  dataPostagem: '',
  dataConclusao: '',
  qtdeJogadores: '1',
  compatControle: false,
  so: [] as string[]
})

watch(
  () => [props.jogo, props.modelValue] as const,
  ([jogo, open]) => {
    if (!open) return
    fotoUrl.value = ''
    fotoUrlErro.value = ''
    if (jogo) {
      form.title = jogo.title
      form.descricao = jogo.descricao
      form.thumb = jogo.thumb
      form.fotos = [...jogo.fotos]
      form.genero = [...jogo.genero]
      form.categorias = [...(jogo.categorias ?? [])]
      form.desenvolvedor = jogo.desenvolvedor
      form.metaValor = jogo.metaValor
      form.valorArrecadado = jogo.valorArrecadado
      form.metaPercentual = jogo.metaPercentual
      form.apoiadores = jogo.apoiadores
      form.dias = jogo.dias
      form.dataPostagem = jogo.dataPostagem
      form.dataConclusao = jogo.dataConclusao
      form.qtdeJogadores = jogo.qtdeJogadores
      form.compatControle = jogo.compatControle
      form.so = [...jogo.so]
      generoTexto.value = form.genero.join(', ')
    } else {
      Object.assign(form, jogoDevVazio())
      form.categorias = []
      form.desenvolvedor = props.nomeEstudio.trim() || form.desenvolvedor
      form.dataPostagem = new Date().toISOString().slice(0, 7)
      generoTexto.value = ''
    }
  },
  { immediate: true }
)

function onSubmit () {
  form.genero = generoTexto.value.split(/[,，]/).map(s => s.trim()).filter(Boolean)
  const base = {
    title: form.title.trim(),
    descricao: form.descricao.trim(),
    thumb: form.thumb.trim(),
    fotos: form.fotos.filter(Boolean),
    genero: form.genero,
    categorias: form.categorias,
    desenvolvedor: form.desenvolvedor.trim(),
    metaValor: form.metaValor.trim(),
    dias: Number(form.dias) || 0,
    dataPostagem: form.dataPostagem || new Date().toISOString().slice(0, 7),
    dataConclusao: form.dataConclusao.trim(),
    qtdeJogadores: form.qtdeJogadores.trim() || '1',
    compatControle: form.compatControle,
    so: form.so
  }
  const valorArrecadado = props.jogo?.valorArrecadado ?? '—'
  const apoiadores = props.jogo?.apoiadores ?? 0
  const metaPercentual = props.jogo?.metaPercentual ?? 0
  const payload = {
    ...base,
    valorArrecadado,
    apoiadores,
    metaPercentual
  }
  if (props.jogo) {
    emit('save', { ...payload, id: props.jogo.id })
  } else {
    emit('save', payload)
  }
}
</script>
