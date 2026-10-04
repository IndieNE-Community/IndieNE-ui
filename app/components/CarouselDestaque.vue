<template>
  <section class="w-full overflow-hidden py-8">
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">
          {{ title }}
        </h2>
        <NuxtLink
          v-if="verTudoHref"
          :to="verTudoHref"
          class="text-sm font-medium text-primary transition hover:text-primary/80"
        >
          Ver tudo
        </NuxtLink>
      </div>
      <div class="relative w-full overflow-hidden">
        <button
          v-show="canScrollPrevious"
          type="button"
          class="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-800/90 text-white shadow-lg transition hover:bg-zinc-700"
          aria-label="Anterior"
          @click="scroll(-1)"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          v-show="canScrollNext"
          type="button"
          class="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-800/90 text-white shadow-lg transition hover:bg-zinc-700"
          aria-label="Próximo"
          @click="scroll(1)"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <div
          ref="scrollRef"
          class="flex w-full gap-5 overflow-x-auto pb-4 scroll-smooth"
          style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none;"
          @scroll.passive="updateScrollState"
        >
          <NuxtLink
            v-for="(item, i) in items"
            :key="item.id ?? i"
            :to="item.id ? `/jogo/${item.id}` : '#'"
            class="relative block w-[220px] shrink-0 rounded-xl bg-zinc-900/80 transition hover:bg-zinc-800/80 sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)] xl:w-[calc((100%-5rem)/5)]"
            style="scroll-snap-align: start;"
          >
            <div class="aspect-square w-full overflow-hidden rounded-t-xl bg-zinc-800">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
                class="h-full w-full object-cover"
              >
              <div
                v-else
                class="flex h-full w-full items-center justify-center text-zinc-500 text-sm"
              >
                Jogo
              </div>
            </div>
            <div class="relative p-3">
              <h3 class="pr-8 text-sm font-semibold text-white line-clamp-1">
                {{ item.title }}
              </h3>
              <p v-if="item.subtitle" class="mt-0.5 text-xs text-zinc-400 line-clamp-1">
                {{ item.subtitle }}
              </p>
              <MetaArrecadacao :percentual="item.metaPercentual" class="mt-3" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  verTudoHref?: string
  items: Array<{ id?: string; title: string; subtitle?: string; image?: string; metaPercentual: number }>
}>()

const scrollRef = ref<HTMLElement | null>(null)
const canScrollPrevious = ref(false)
const canScrollNext = ref(false)
let resizeObserver: ResizeObserver | undefined

function updateScrollState () {
  const el = scrollRef.value
  if (!el) return
  canScrollPrevious.value = el.scrollLeft > 1
  canScrollNext.value = el.scrollWidth - el.clientWidth - el.scrollLeft > 1
}

onMounted(() => {
  updateScrollState()
  resizeObserver = new ResizeObserver(updateScrollState)
  if (scrollRef.value) resizeObserver.observe(scrollRef.value)
})

onBeforeUnmount(() => resizeObserver?.disconnect())
watch(() => props.items.length, updateScrollState, { flush: 'post' })

function scroll (direction: number) {
  const el = scrollRef.value
  const card = el?.firstElementChild
  if (!el || !card) return
  const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap)
  el.scrollBy({ left: step * direction, behavior: 'smooth' })
}
</script>
