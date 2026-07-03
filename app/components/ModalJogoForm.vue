<template>
  <Teleport to="body">
    <div
      v-show="modelValue"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      @click.self="emit('update:modelValue', false)"
    >
      <div
        class="max-h-[90vh] w-full overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl sm:max-w-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
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
              <label class="block text-sm font-medium text-white">Título</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Nome do jogo"
              >
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-white">Descrição (Bio)</label>
              <textarea
                v-model="form.descricao"
                rows="3"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Descreva o jogo..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white">Meta de arrecadação</label>
              <input
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
              <label class="block text-sm font-medium text-white">Dias (campanha)</label>
              <input
                v-model.number="form.dias"
                type="number"
                min="0"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-white">Data postagem (YYYY-MM)</label>
              <input
                v-model="form.dataPostagem"
                type="month"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-white">Data conclusão (YYYY-MM)</label>
              <input
                v-model="form.dataConclusao"
                type="text"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="2025-06 ou vazio"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-white">Qtde. jogadores</label>
              <input
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
              <label class="block text-sm font-medium text-white">Gêneros (separados por vírgula)</label>
              <input
                v-model="generoTexto"
                type="text"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Roguelike, Ação, Multijogador"
              >
            </div>
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
              <label class="block text-sm font-medium text-white">Imagem principal (thumb/hero)</label>
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
              <input
                ref="fotosInputRef"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="onFotosChange"
              >
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-zinc-600 text-zinc-500 transition hover:border-primary hover:text-primary"
                  @click="fotosInputRef?.click()"
                >
                  <span class="text-2xl">+</span>
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
              <p class="mt-2 text-xs text-zinc-500">
                Imagens são redimensionadas e salvas localmente (localStorage). Evite muitas fotos muito grandes.
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
              class="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-dark transition hover:bg-primary/90"
            >
              {{ isEdit ? 'Salvar' : 'Criar jogo' }}
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
  }>(),
  { nomeEstudio: '' }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [payload: JogoDev | Omit<JogoDev, 'id'>]
}>()

const isEdit = computed(() => !!props.jogo)

/** Texto livre para gêneros (vírgulas não são removidas enquanto digita) */
const generoTexto = ref('')
const thumbInputRef = ref<HTMLInputElement | null>(null)
const fotosInputRef = ref<HTMLInputElement | null>(null)

/** Redimensiona e comprime imagem para caber no localStorage; retorna data URL */
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

const form = reactive({
  title: '',
  descricao: '',
  thumb: '',
  fotos: [] as string[],
  genero: [] as string[],
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
    if (jogo) {
      form.title = jogo.title
      form.descricao = jogo.descricao
      form.thumb = jogo.thumb
      form.fotos = [...jogo.fotos]
      form.genero = [...jogo.genero]
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
  emit('update:modelValue', false)
}
</script>
