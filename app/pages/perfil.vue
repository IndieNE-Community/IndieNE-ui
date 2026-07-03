<template>
  <div class="min-h-screen bg-dark">
    <div class="mx-auto max-w-xl px-6 py-12 sm:px-8">
      <div class="rounded-xl border border-zinc-700 bg-zinc-900/50 p-8">
        <h1 class="text-2xl font-bold text-white">
          Meu perfil
        </h1>
        <p class="mt-2 text-sm text-muted">
          Dados da sua conta.
        </p>

        <div class="mt-8 space-y-4">
          <div>
            <span class="text-sm text-muted">Nome</span>
            <p class="mt-1 text-white">
              {{ user?.nome ?? '—' }}
            </p>
          </div>
          <div>
            <span class="text-sm text-muted">E-mail</span>
            <p class="mt-1 text-white">
              {{ user?.email ?? '—' }}
            </p>
          </div>
        </div>

        <div class="mt-10 flex flex-col gap-3 sm:flex-row">
          <NuxtLink
            to="/area-dev"
            class="rounded-lg bg-primary px-6 py-3 text-center text-sm font-medium text-dark transition hover:bg-primary/90"
          >
            Ir para Área DEV
          </NuxtLink>
          <button
            type="button"
            class="rounded-lg border border-zinc-600 bg-transparent px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            @click="sair"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

const router = useRouter()
const { user, logout } = useAuth()

function sair () {
  logout()
  router.push('/')
}

</script>
