<template>
  <div class="min-h-screen bg-dark">
    <div class="mx-auto max-w-3xl px-6 py-8 sm:px-8 lg:px-12">
      <h1 class="text-2xl font-bold text-white">
        Desenvolvedores
      </h1>
      <p class="mt-2 text-muted">
        Estúdios e criadores com jogos na IndieNE.
      </p>
      <p v-if="loading" class="mt-8 text-center text-zinc-400" role="status">Carregando desenvolvedores...</p>
      <div v-else-if="error" class="mt-8 text-center">
        <p class="text-red-400">{{ error }}</p>
        <button type="button" class="mt-4 text-primary hover:underline" @click="refresh(true)">Tentar novamente</button>
      </div>
      <p v-else-if="!desenvolvedoresUnicos.length" class="mt-8 text-center text-zinc-500">Nenhum desenvolvedor publicado.</p>
      <ul class="mt-8 flex flex-col gap-2">
        <li
          v-for="nome in desenvolvedoresUnicos"
          :key="nome"
        >
          <NuxtLink
            :to="`/desenvolvedores/${slugify(nome)}`"
            class="block rounded-lg border border-zinc-700/50 bg-zinc-900/50 px-4 py-3 text-white transition hover:border-primary/30 hover:bg-zinc-900"
          >
            <span class="font-medium">{{ nome }}</span>
            <span class="ml-2 text-sm text-muted">({{ qtdeJogos(nome) }} jogo(s))</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { slugify } from '~/utils/slug'

const { allJogos, loading, error, refresh } = useJogos()
const desenvolvedoresUnicos = computed(() =>
  Array.from(new Set(allJogos.value.map(jogo => jogo.desenvolvedor))).sort()
)

function qtdeJogos (nome: string) {
  return allJogos.value.filter(jogo => jogo.desenvolvedor === nome).length
}

await refresh()
</script>
