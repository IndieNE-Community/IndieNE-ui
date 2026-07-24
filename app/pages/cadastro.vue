<template>
  <div class="min-h-screen bg-dark flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <div class="rounded-xl border border-zinc-700 bg-zinc-900/50 p-8">
        <h1 class="text-2xl font-bold text-white">
          Criar perfil
        </h1>
        <p class="mt-2 text-sm text-muted">
          Escolha como você deseja participar da comunidade IndieNE.
        </p>

        <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
          <div>
            <fieldset>
              <legend class="block text-sm font-medium text-white">Tipo de perfil</legend>
              <div class="mt-2 grid gap-3 sm:grid-cols-2">
                <label
                  v-for="opcao in tiposPerfil"
                  :key="opcao.value"
                  class="cursor-pointer rounded-lg border p-4 transition focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-dark"
                  :class="tipo === opcao.value ? 'border-primary bg-primary/10' : 'border-zinc-700 bg-surface hover:border-zinc-500'"
                >
                  <input v-model="tipo" type="radio" name="tipo-perfil" :value="opcao.value" class="sr-only">
                  <span class="block text-sm font-medium text-white">{{ opcao.label }}</span>
                  <span class="mt-1 block text-xs text-zinc-400">{{ opcao.descricao }}</span>
                </label>
              </div>
            </fieldset>
          </div>
          <div>
            <label for="cadastro-nome" class="block text-sm font-medium text-white">Nome</label>
            <input
              id="cadastro-nome"
              v-model="nome"
              type="text"
              required
              autocomplete="name"
              class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Seu nome ou nome do estúdio"
            >
          </div>
          <div>
            <label for="cadastro-email" class="block text-sm font-medium text-white">E-mail</label>
            <input
              id="cadastro-email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="seu@email.com"
            >
          </div>
          <div>
            <label for="cadastro-senha" class="block text-sm font-medium text-white">Senha</label>
            <input
              id="cadastro-senha"
              v-model="senha"
              type="password"
              required
              autocomplete="new-password"
              minlength="8"
              class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Mínimo 8 caracteres"
            >
          </div>
          <div>
            <label for="cadastro-confirmar" class="block text-sm font-medium text-white">Confirmar senha</label>
            <input
              id="cadastro-confirmar"
              v-model="confirmarSenha"
              type="password"
              required
              autocomplete="new-password"
              class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Repita a senha"
            >
            <p v-if="confirmarSenha && senha !== confirmarSenha" class="mt-1 text-sm text-red-400">
              As senhas não coincidem.
            </p>
          </div>

          <p v-if="erro" class="text-sm text-red-400">
            {{ erro }}
          </p>

          <button
            type="submit"
            :disabled="loading || senha !== confirmarSenha"
            class="w-full rounded-lg bg-primary py-3 text-base font-medium text-dark transition hover:bg-primary/90 disabled:opacity-50"
          >
            {{ loading ? 'Cadastrando...' : 'Criar perfil' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-muted">
          Já tem conta?
          <NuxtLink to="/login" class="font-medium text-primary hover:underline">
            Fazer login
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiUser } from '~/types/user.interface'

const { register, isLoggedIn } = useAuth()
const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const tipo = ref<ApiUser['tipo']>('USUARIO_COMUM')
const erro = ref('')
const loading = ref(false)
const tiposPerfil: Array<{ value: ApiUser['tipo'], label: string, descricao: string }> = [
  { value: 'USUARIO_COMUM', label: 'Usuário comum', descricao: 'Descubra, acompanhe e apoie jogos.' },
  { value: 'DESENVOLVEDOR', label: 'Desenvolvedor', descricao: 'Publique jogos e acesse a Área DEV.' }
]

if (isLoggedIn.value) {
  const { isDeveloper } = useAuth()
  await navigateTo(isDeveloper.value ? '/area-dev' : '/perfil')
}

async function onSubmit () {
  if (senha.value !== confirmarSenha.value) {
    erro.value = 'As senhas não coincidem.'
    return
  }

  erro.value = ''
  loading.value = true
  try {
    const resultado = await register(nome.value, email.value, senha.value, tipo.value)
    if (resultado.ok) await navigateTo(tipo.value === 'DESENVOLVEDOR' ? '/area-dev' : '/perfil')
    else erro.value = resultado.erro ?? 'Erro ao cadastrar.'
  } finally {
    loading.value = false
  }
}

</script>
