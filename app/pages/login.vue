<template>
  <div class="min-h-screen bg-dark flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <div class="rounded-xl border border-zinc-700 bg-zinc-900/50 p-8">
        <h1 class="text-2xl font-bold text-white">
          Entrar
        </h1>
        <p class="mt-2 text-sm text-muted">
          Use seu e-mail e senha para acessar a Área DEV.
        </p>

        <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
          <div>
            <label for="login-email" class="block text-sm font-medium text-white">E-mail</label>
            <input
              id="login-email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="seu@email.com"
            >
          </div>
          <div>
            <label for="login-senha" class="block text-sm font-medium text-white">Senha</label>
            <input
              id="login-senha"
              v-model="senha"
              type="password"
              required
              autocomplete="current-password"
              class="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            >
          </div>

          <p v-if="erro" class="text-sm text-red-400">
            {{ erro }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-primary py-3 text-base font-medium text-dark transition hover:bg-primary/90 disabled:opacity-50"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-muted">
          Ainda não tem conta?
          <NuxtLink to="/cadastro" class="font-medium text-primary hover:underline">
            Criar perfil
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, isLoggedIn } = useAuth()
const email = ref('')
const senha = ref('')
const erro = ref('')
const loading = ref(false)

if (isLoggedIn.value) await navigateTo('/area-dev')

async function onSubmit () {
  erro.value = ''
  loading.value = true
  try {
    const resultado = await login(email.value, senha.value)
    if (resultado.ok) await navigateTo('/area-dev')
    else erro.value = resultado.erro ?? 'Erro ao entrar.'
  } finally {
    loading.value = false
  }
}

</script>
