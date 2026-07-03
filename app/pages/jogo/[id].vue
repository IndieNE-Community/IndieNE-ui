<template>
  <div class="min-h-screen bg-dark">
    <div class="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
      <div class="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <!-- Coluna principal: hero + atualizações -->
        <div class="min-w-0 flex-1">
          <!-- Hero image -->
          <div class="overflow-hidden rounded-xl bg-zinc-800">
            <div class="aspect-video w-full bg-zinc-800">
              <img
                v-if="jogo.hero"
                :src="jogo.hero"
                :alt="jogo.titulo"
                class="h-full w-full object-cover"
              >
              <div
                v-else
                class="flex h-full w-full items-center justify-center text-zinc-500"
              >
                {{ jogo.titulo }}
              </div>
            </div>
          </div>

          <!-- ATUALIZAÇÕES -->
          <div class="mt-10 border-t border-zinc-700 pt-8">
            <h2 class="text-center text-sm font-medium uppercase tracking-widest text-white">
              Atualizações
            </h2>
            <div class="mt-6 flex flex-col gap-6">
              <article
                v-for="(atualizacao, idx) in jogo.atualizacoes"
                :key="idx"
                class="rounded-xl border border-primary/50 bg-zinc-900/50 p-6"
              >
                <h3 class="text-lg font-bold text-white">
                  {{ atualizacao.titulo }}
                </h3>
                <p class="mt-2 text-sm text-zinc-400">
                  {{ atualizacao.data }}
                </p>
                <div class="mt-4 overflow-hidden rounded-lg bg-zinc-800">
                  <div class="aspect-video w-full">
                    <img
                      v-if="atualizacao.imagem"
                      :src="atualizacao.imagem"
                      :alt="atualizacao.titulo"
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
                  {{ atualizacao.descricao }}
                </p>
                <!-- Comentários -->
                <div class="mt-6 space-y-4 border-t border-zinc-700 pt-4">
                  <div
                    v-for="(comentario, cIdx) in comentariosPorAtualizacao(idx)"
                    :key="'c-' + idx + '-' + cIdx"
                    class="flex gap-3"
                  >
                    <img
                      :src="comentario.avatar"
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
                      <div class="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                        <button
                          v-if="isLoggedIn"
                          type="button"
                          :class="[
                            'flex items-center gap-1 rounded px-2 py-1 transition',
                            reacaoAtual(idx, cIdx) === 'like'
                              ? 'bg-primary/20 text-primary'
                              : 'hover:bg-zinc-700'
                          ]"
                          :title="'Curtir'"
                          @click="reagir(idx, cIdx, 'like')"
                        >
                          <span aria-hidden="true">👍</span>
                          {{ totalLikes(idx, cIdx) }}
                        </button>
                        <span v-else class="flex items-center gap-1">
                          <span aria-hidden="true">👍</span>
                          {{ totalLikes(idx, cIdx) }}
                        </span>
                        <button
                          v-if="isLoggedIn"
                          type="button"
                          :class="[
                            'flex items-center gap-1 rounded px-2 py-1 transition',
                            reacaoAtual(idx, cIdx) === 'dislike'
                              ? 'bg-primary/20 text-primary'
                              : 'hover:bg-zinc-700'
                          ]"
                          :title="'Não curtir'"
                          @click="reagir(idx, cIdx, 'dislike')"
                        >
                          <span aria-hidden="true">👎</span>
                          {{ totalDislikes(idx, cIdx) }}
                        </button>
                        <span v-else class="flex items-center gap-1">
                          <span aria-hidden="true">👎</span>
                          {{ totalDislikes(idx, cIdx) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <form
                    v-if="isLoggedIn"
                    class="flex items-end gap-3"
                    @submit.prevent="enviarComentario(idx)"
                  >
                    <img
                      :src="avatarUsuarioAtual"
                      alt=""
                      class="h-10 w-10 shrink-0 rounded-full object-cover bg-zinc-700"
                    >
                    <input
                      v-model="getForm(idx).texto"
                      type="text"
                      placeholder="Adicione um comentário..."
                      class="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-surface px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none"
                    >
                    <button
                      type="submit"
                      class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-dark transition hover:bg-primary/90"
                    >
                      Enviar
                    </button>
                  </form>
                  <p v-else class="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-500">
                    <NuxtLink to="/login" class="font-medium text-primary hover:underline">
                      Faça login
                    </NuxtLink>
                    para comentar.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>

        <!-- Sidebar: info do jogo -->
        <aside class="w-full shrink-0 lg:w-96">
          <div class="lg:sticky lg:top-24">
            <h1 class="text-3xl font-bold text-white">
              {{ jogo.titulo }}
            </h1>
            <!-- Tags -->
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="tag in jogo.tags"
                :key="tag"
                class="rounded-full bg-zinc-800 px-3 py-1 text-sm text-white"
              >
                {{ tag }}
              </span>
              <button
                type="button"
                class="rounded-full bg-zinc-800 px-3 py-1 text-sm text-white transition hover:bg-zinc-700"
                aria-label="Mais tags"
              >
                +
              </button>
            </div>
            <p class="mt-6 text-sm leading-relaxed text-white">
              {{ jogo.descricao }}
            </p>
            <p v-if="jogo.desenvolvedor" class="mt-6 text-sm text-white">
              <span class="text-muted">Desenvolvedor:&nbsp;</span>
              <NuxtLink :to="`/desenvolvedores/${slugDev}`" class="text-primary hover:underline">
                {{ jogo.desenvolvedor }} (ver mais jogos)
              </NuxtLink>
            </p>

            <!-- Crowdfunding -->
            <div class="mt-8 rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
              <p class="text-3xl font-bold text-white">
                {{ valorArrecadadoFormatado }}
              </p>
              <p class="mt-2 text-sm text-white">
                apoiado por {{ totalApoiadores }} pessoas em {{ jogo.dias }} dias
              </p>
              <div class="mt-3 h-2 overflow-hidden rounded-full bg-zinc-700">
                <div
                  class="h-full rounded-full bg-primary transition-all"
                  :style="{ width: percentualMeta + '%' }"
                />
              </div>
              <p class="mt-2 text-sm font-medium text-white">
                {{ percentualMeta }}%
              </p>
              <p class="mt-1 text-sm text-white">
                Meta {{ formatarMoeda(jogo.metaValor) }}
              </p>
              <NuxtLink
                :to="`/contribuir?jogo=${id}`"
                class="mt-6 flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold uppercase tracking-wide text-dark transition hover:bg-primary/90"
              >
                Contribuir
              </NuxtLink>
            </div>

            <!-- FOTOS (dos posts) -->
            <div class="mt-10 border-t border-zinc-700 pt-8">
              <h2 class="text-center text-sm font-medium uppercase tracking-widest text-white">
                Fotos
              </h2>
              <p class="mt-1 text-center text-xs text-zinc-500">
                Clique para ampliar
              </p>
              <div class="mt-6 grid grid-cols-3 gap-2">
                <template v-if="fotosDosPosts.length">
                  <button
                    v-for="(foto, fIdx) in fotosDosPosts"
                    :key="fIdx"
                    type="button"
                    class="aspect-square overflow-hidden rounded-lg bg-zinc-800 transition hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    @click="abrirFotoModal(foto)"
                  >
                    <img
                      :src="foto.src"
                      :alt="foto.titulo"
                      class="h-full w-full object-cover"
                    >
                  </button>
                </template>
                <div v-else class="col-span-3 rounded-lg border border-dashed border-zinc-600 py-8 text-center text-sm text-zinc-500">
                  Nenhuma foto nos posts deste jogo.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { useJogoDetalhes } from '~/composables/useJogoDetalhes'

const {
  id, jogo, slugDev, comentariosPorAtualizacao, totalLikes, totalDislikes,
  reacaoAtual, reagir, getForm, enviarComentario, isLoggedIn,
  avatarUsuarioAtual, totalApoiadores, valorArrecadadoFormatado,
  percentualMeta, formatarMoeda, fotosDosPosts, fotoModal,
  abrirFotoModal, fecharFotoModal
} = useJogoDetalhes()
</script>

<style scoped src="../../assets/css/pages/jogo-detalhes.css"></style>
