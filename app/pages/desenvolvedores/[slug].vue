<template>
  <div class="min-h-screen bg-dark">
    <div class="mx-auto max-w-5xl px-6 py-8 sm:px-8 lg:px-12">
      <p v-if="loading" class="py-16 text-center text-zinc-400" role="status">Carregando desenvolvedor...</p>
      <div v-else-if="error" class="py-16 text-center">
        <p class="text-red-400">{{ error }}</p>
        <button type="button" class="mt-4 text-primary hover:underline" @click="refresh(true)">Tentar novamente</button>
      </div>
      <template v-else-if="desenvolvedor">
        <!-- Cabeçalho do desenvolvedor -->
        <header class="mb-10">
          <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div class="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-800" />
            <div class="min-w-0">
              <h1 class="text-3xl font-bold text-white">
                {{ desenvolvedor }}
              </h1>
              <p class="mt-2 text-muted">
                Desenvolvedor / Estúdio indie
              </p>
              <p class="mt-4 max-w-xl text-sm leading-relaxed text-white">
                Conheça os jogos publicados na IndieNE por {{ desenvolvedor }}.
              </p>
            </div>
          </div>
        </header>

        <!-- Lista de jogos -->
        <section>
          <h2 class="text-lg font-bold text-white">
            Jogos ({{ jogosDoDesenvolvedor.length }})
          </h2>
          <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li
              v-for="jogo in jogosDoDesenvolvedor"
              :key="jogo.id"
            >
              <NuxtLink
                :to="`/jogo/${jogo.id}`"
                class="group block overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900/50 transition hover:border-primary/30 hover:bg-zinc-900"
              >
                <div class="aspect-video w-full overflow-hidden bg-zinc-800">
                  <img
                    v-if="jogo.thumb"
                    :src="jogo.thumb"
                    :alt="jogo.title"
                    class="h-full w-full object-cover transition group-hover:scale-105"
                  >
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center text-zinc-500 text-sm"
                  >
                    {{ jogo.title }}
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="font-semibold text-white group-hover:text-primary">
                    {{ jogo.title }}
                  </h3>
                  <div class="mt-2 flex flex-wrap gap-1">
                    <span
                      v-for="g in jogo.genero.slice(0, 3)"
                      :key="g"
                      class="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                    >
                      {{ g }}
                    </span>
                  </div>
                  <p class="mt-2 text-sm text-muted">
                    {{ jogo.metaPercentual }}% meta
                  </p>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </section>
      </template>

      <div v-else class="py-16 text-center">
        <p class="text-xl text-white">
          Desenvolvedor não encontrado.
        </p>
        <NuxtLink
          to="/explorar"
          class="mt-4 inline-block text-primary hover:underline"
        >
          Voltar para Explorar
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { slugify } from '~/utils/slug'

const route = useRoute()
const slug = computed(() => (route.params.slug as string) ?? '')
const { allJogos, loading, error, refresh } = useJogos()
const jogosDoDesenvolvedor = computed(() =>
  slug.value ? allJogos.value.filter(jogo => slugify(jogo.desenvolvedor) === slug.value) : []
)
const desenvolvedor = computed(() => jogosDoDesenvolvedor.value[0]?.desenvolvedor ?? null)

await refresh()
</script>
