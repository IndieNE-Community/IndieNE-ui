<template>
  <Teleport to="body">
    <div
      v-show="modelValue"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-novo-post-title"
      @click.self="emit('update:modelValue', false)"
    >
      <div
        ref="dialogRef"
        class="w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl"
        tabindex="-1"
        @click.stop
      >
        <!-- Header estilo Twitter: título + X -->
        <div class="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
          <button
            type="button"
            class="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Fechar"
            @click="emit('update:modelValue', false)"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 id="modal-novo-post-title" class="text-base font-bold text-white">
            Novo post
          </h2>
          <div class="w-9" />
        </div>

        <form class="p-4" @submit.prevent="onSubmit">
          <p v-if="jogoTitle" class="mb-3 text-xs text-zinc-500">
            Publicando em <span class="font-medium text-zinc-400">{{ jogoTitle }}</span>
          </p>
          <input
            v-model="titulo"
            type="text"
            aria-label="Título da publicação"
            placeholder="Título do post"
            class="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none"
          >
          <textarea
            v-model="descricao"
            rows="4"
            placeholder="O que está acontecendo?"
            aria-label="Descrição da publicação"
            class="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none"
          />
          <div class="mt-3">
            <p class="mb-2 text-xs text-amber-300" role="note">Upload local aguarda suporte da API. Uma imagem selecionada não poderá ser publicada ainda.</p>
            <input
              ref="imagemInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onImagemChange"
            >
            <div class="flex flex-wrap items-center gap-3">
              <button
                type="button"
                class="flex h-12 items-center gap-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 transition hover:border-primary hover:text-primary"
                @click="imagemInputRef?.click()"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ imagemDataUrl ? 'Trocar imagem' : 'Enviar imagem' }}
              </button>
              <button
                v-if="imagemDataUrl"
                type="button"
                class="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                @click="imagemDataUrl = ''"
              >
                Remover
              </button>
            </div>
            <div v-if="imagemDataUrl" class="mt-2 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
              <img :src="imagemDataUrl" alt="Preview" class="max-h-40 w-full object-contain">
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <button
              type="submit"
              :disabled="!podePostar"
              class="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-dark transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
            >
              {{ saving ? 'Publicando...' : 'Postar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  jogoId: string
  jogoTitle?: string
  saving?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  post: [payload: { titulo: string; descricao: string; imagem?: string }]
}>()

const titulo = ref('')
const descricao = ref('')
const imagemDataUrl = ref('')
const imagemInputRef = ref<HTMLInputElement | null>(null)
const dialogRef = ref<HTMLElement | null>(null)
useDialogFocus(toRef(props, 'modelValue'), dialogRef)

const podePostar = computed(() =>
  !props.saving && (titulo.value.trim().length > 0 || descricao.value.trim().length > 0)
)

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      titulo.value = ''
      descricao.value = ''
      imagemDataUrl.value = ''
    }
  }
)

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

async function onImagemChange (e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file?.type.startsWith('image/')) return
  try {
    imagemDataUrl.value = await readImageAsDataUrl(file, 1200, 0.8)
  } catch {
    const reader = new FileReader()
    reader.onload = () => { imagemDataUrl.value = reader.result as string }
    reader.readAsDataURL(file)
  }
  input.value = ''
}

function onSubmit () {
  if (!podePostar.value) return
  const payload = {
    titulo: titulo.value.trim() || 'Atualização',
    descricao: descricao.value.trim(),
    imagem: imagemDataUrl.value || undefined
  }
  emit('post', payload)
}
</script>
