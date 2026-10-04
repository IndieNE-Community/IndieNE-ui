<template>
  <section class="w-full overflow-hidden bg-zinc-900 py-8">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        ref="heroRef"
        class="flex gap-0 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;"
      >
        <div
          v-for="(item, i) in items"
          :key="item.id ?? i"
          class="flex min-w-full shrink-0 flex-col rounded-2xl bg-zinc-900 p-0 md:flex-row"
          style="scroll-snap-align: start;"
        >
          <!-- Lado esquerdo: imagem do jogo (altura fixa para não quebrar com imagens de tamanhos diferentes) -->
          <div class="relative flex-1 min-w-0 overflow-hidden rounded-xl">
            <div class="relative h-[240px] w-full overflow-hidden rounded-xl bg-zinc-800 md:h-[320px] md:min-w-[560px]">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
                class="absolute inset-0 h-full w-full object-cover object-center"
              >
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-zinc-800 text-zinc-500"
              >
                {{ item.title }}
              </div>
            </div>
            <div class="absolute bottom-4 left-4 text-2xl font-bold uppercase tracking-wide text-white drop-shadow-lg md:text-3xl">
              {{ item.title }}
            </div>
          </div>

          <!-- Lado direito: card branco -->
          <div class="flex w-full shrink-0 flex-col justify-between rounded-2xl border border-primary border-l-0 rounded-l-none p-6 text-zinc-900 shadow-xl md:max-w-md h-[80%] my-auto">
            <div>
              <h2 class="text-2xl font-bold text-primary">
                {{ item.title }}
              </h2>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="tag in (item.tags || [])"
                  :key="tag"
                  class="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary"
                >
                  {{ tag }}
                </span>
              </div>
              <p v-if="item.developer" class="mt-4 text-sm text-zinc-500">
                Desenvolvedor:&nbsp;{{ item.developer }}
              </p>
              <MetaArrecadacao :percentual="item.metaPercentual" class="mt-4" />
            </div>
            <div class="mt-10">
              <NuxtLink
                :to="item.id ? `/jogo/${item.id}` : '#'"
                class="block w-full rounded-lg bg-primary py-3 text-center font-semibold text-zinc-900 transition hover:bg-primary/90"
              >
                Ver mais
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <!-- Indicadores do carrossel -->
      <div class="mt-6 flex justify-center gap-2">
        <button
          v-for="(_, i) in items"
          :key="i"
          type="button"
          :class="[
            'h-1.5 rounded-full transition-all',
            i === heroIndex ? 'w-6 bg-primary' : 'w-1.5 bg-zinc-600'
          ]"
          :aria-label="`Slide ${i + 1}`"
          @click="goTo(i)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: Array<{
    id?: string
    title: string
    subtitle?: string
    image?: string
    tags?: string[]
    developer?: string
    metaPercentual: number
  }>
}>()

const heroRef = ref<HTMLElement | null>(null)
const heroIndex = ref(0)

function goTo (index: number) {
  heroIndex.value = index
  const el = heroRef.value
  if (!el) return
  const slide = el.children[index] as HTMLElement
  if (slide) slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
}

function onScroll () {
  const el = heroRef.value
  if (!el || !props.items.length) return
  const index = Math.round(el.scrollLeft / el.offsetWidth)
  heroIndex.value = Math.min(index, props.items.length - 1)
}

onMounted(() => {
  heroRef.value?.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
  heroRef.value?.removeEventListener('scroll', onScroll)
})
</script>
