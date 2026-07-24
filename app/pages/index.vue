<template>
  <div>
    <section v-if="loading" class="mx-auto max-w-7xl px-6 py-20 text-center text-zinc-400" role="status">
      Carregando jogos...
    </section>
    <section v-else-if="error" class="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 class="text-xl font-bold text-white">Não foi possível carregar a página inicial</h1>
      <p class="mt-2 text-sm text-red-400">{{ error }}</p>
      <button type="button" class="mt-6 rounded-lg bg-primary px-5 py-2.5 font-medium text-dark" @click="refresh(true)">
        Tentar novamente
      </button>
    </section>
    <section v-else-if="!allJogos.length" class="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 class="text-xl font-bold text-white">Nenhum jogo publicado</h1>
      <p class="mt-2 text-zinc-400">Os jogos cadastrados aparecerão aqui.</p>
    </section>
    <template v-else>
    <CarouselHero :items="destaqueHero" />

    <!-- Destaques -->
    <CarouselDestaque
      title="Destaques"
      :items="jogosDestaque"
    />

    <!-- Por categoria: Sobrevivência, RPG -->
    <CarouselDestaque
      title="Sobrevivência"
      ver-tudo-href="/explorar?genero=Survival"
      :items="jogosSobrevivencia"
    />
    <CarouselDestaque
      title="RPG"
      ver-tudo-href="/explorar?genero=RPG"
      :items="jogosRpg"
    />

    <!-- Últimas postagens -->
    <section class="border-t border-zinc-800/80 py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">
            Últimas postagens
          </h2>

        </div>
        <p v-if="postsLoading" class="py-8 text-center text-zinc-400" role="status">Carregando publicações...</p>
        <div v-else-if="postsError" class="py-8 text-center">
          <p class="text-sm text-red-400">{{ postsError }}</p>
          <button type="button" class="mt-4 rounded-lg border border-primary px-4 py-2 text-sm text-primary" @click="refreshPosts">
            Tentar novamente
          </button>
        </div>
        <p v-else-if="!ultimasPostagensPagina.length" class="py-8 text-center text-zinc-500">
          Ainda não há publicações.
        </p>
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="(post, i) in ultimasPostagensPagina"
            :key="post.id"
            :to="`/jogo/${post.jogoId}`"
            class="block rounded-xl bg-zinc-900/80 overflow-hidden transition hover:bg-zinc-800/80"
          >
            <article class="h-full">
              <div class="aspect-video w-full overflow-hidden bg-zinc-800">
                <img
                  v-if="post.thumb"
                  :src="post.thumb"
                  :alt="post.titulo"
                  class="h-full w-full object-cover"
                >
                <div v-else class="flex h-full w-full items-center justify-center text-zinc-500 text-sm">
                  Post
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-white line-clamp-2">
                  {{ post.titulo }}
                </h3>
                <p class="mt-1 text-sm text-zinc-400">
                  {{ post.autor }}
                </p>
                <p v-if="post.descricao" class="mt-2 text-sm text-zinc-500 line-clamp-2">
                  {{ post.descricao }}
                </p>
              </div>
            </article>
          </NuxtLink>
        </div>

        <!-- Paginação -->
        <div
          v-if="totalPaginas > 1"
          class="mt-10 flex items-center justify-center gap-1"
        >
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
            aria-label="Página anterior"
            :disabled="paginaAtual <= 1"
            @click="paginaAtual = Math.max(1, paginaAtual - 1)"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <template v-for="(p, indice) in paginationPages" :key="`${p}-${indice}`">
          <button
            v-if="p !== -1"
            type="button"
            :class="[
              'flex h-9 min-w-9 items-center justify-center rounded px-2 text-sm font-medium transition',
              p === paginaAtual
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            ]"
            @click="paginaAtual = p"
          >
            {{ p }}
          </button>
          <span v-else class="flex h-9 items-center px-1 text-zinc-500" aria-hidden="true">…</span>
          </template>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Próxima página"
            :disabled="paginaAtual >= totalPaginas"
            @click="paginaAtual = Math.min(totalPaginas, paginaAtual + 1)"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const ITENS_POR_PAGINA = 8

const { allJogos, loading, error, refresh, destaqueHero, jogosDestaque, jogosSobrevivencia, jogosRpg } = useJogos()
const {
  publicacoes: ultimasPostagens,
  loading: postsLoading,
  error: postsError,
  refresh: refreshPosts
} = usePublicacoesPublicas()
const {
  paginaAtual,
  totalPaginas,
  paginationPages,
  itensExibidos: ultimasPostagensPagina
} = usePagination(ultimasPostagens, ITENS_POR_PAGINA, true)

await refresh()
if (!error.value) await refreshPosts()
</script>
