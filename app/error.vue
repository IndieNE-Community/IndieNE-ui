<template>
  <NuxtLayout name="default">
    <main class="flex min-h-[70vh] items-center justify-center px-6 py-16 text-center">
      <div class="max-w-lg">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">{{ statusCode }}</p>
        <h1 class="mt-3 text-3xl font-bold text-white">{{ titulo }}</h1>
        <p class="mt-4 text-zinc-400">{{ descricao }}</p>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" class="rounded-lg bg-primary px-6 py-3 font-medium text-dark" @click="voltarInicio">Ir para o início</button>
          <button type="button" class="rounded-lg border border-zinc-600 px-6 py-3 text-white hover:bg-zinc-800" @click="voltar">Voltar</button>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number } }>()
const statusCode = computed(() => props.error.statusCode ?? 500)
const titulo = computed(() => statusCode.value === 404 ? 'Página não encontrada' : statusCode.value === 403 ? 'Acesso negado' : 'Algo deu errado')
const descricao = computed(() => statusCode.value === 404
  ? 'O endereço informado não existe ou foi removido.'
  : statusCode.value === 403
    ? 'Você não possui permissão para acessar este conteúdo.'
    : 'Não foi possível concluir esta operação. Tente novamente.')
function voltarInicio () { clearError({ redirect: '/' }) }
function voltar () {
  if (import.meta.client && window.history.length > 1) window.history.back()
  else clearError({ redirect: '/' })
}
</script>
