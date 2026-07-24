<template>
  <div class="min-h-screen bg-dark text-zinc-100">
    <header class="sticky top-0 z-50 border-b border-zinc-800 bg-dark/95 backdrop-blur-sm">
      <div class="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-8 lg:px-12">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight">
          <span class="text-white">indie</span><span class="text-primary">NE</span>
        </NuxtLink>

        <nav class="hidden items-center gap-8 md:flex">
          <NuxtLink
            to="/"
            class="text-sm font-normal transition hover:opacity-90"
            :class="$route.path === '/' ? 'text-primary' : 'text-muted'"
          >
            Início
          </NuxtLink>
          <NuxtLink
            to="/explorar"
            class="text-sm font-normal transition hover:opacity-90"
            :class="$route.path === '/explorar' ? 'text-primary' : 'text-muted'"
          >
            Explorar
          </NuxtLink>
          <NuxtLink
            to="/como-funciona"
            class="text-sm font-normal transition hover:opacity-90"
            :class="$route.path === '/como-funciona' ? 'text-primary' : 'text-muted'"
          >
            Como Funciona
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <template v-if="isLoggedIn">
            <NuxtLink
              v-if="isDeveloper"
              to="/area-dev"
              class="hidden rounded-lg px-5 py-2.5 text-sm font-normal transition md:inline-flex"
              :class="$route.path === '/area-dev' ? 'bg-primary text-dark hover:bg-primary/90' : 'border border-primary bg-transparent text-primary hover:bg-primary/10'"
            >
              Área DEV
            </NuxtLink>
            <NuxtLink
              to="/perfil"
              class="hidden rounded-lg border border-primary bg-transparent px-5 py-2.5 text-sm font-normal text-primary transition hover:bg-primary/10 md:inline-flex"
            >
              Meu perfil
            </NuxtLink>
          </template>
          <template v-else>
            <span
              class="hidden cursor-not-allowed rounded-lg border border-zinc-600 bg-zinc-800/50 px-5 py-2.5 text-sm font-normal text-zinc-500 md:inline-flex"
              title="Faça login para acessar a Área DEV"
            >
              Área DEV
            </span>
            <NuxtLink
              to="/login"
              class="hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-normal text-dark transition hover:bg-primary/90 md:inline-flex"
            >
              Login / Cadastro
            </NuxtLink>
          </template>
          <button
            type="button"
            class="rounded-lg border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-800 md:hidden"
            :aria-expanded="menuAberto"
            aria-controls="menu-mobile"
            aria-label="Abrir menu de navegação"
            @click="menuAberto = !menuAberto"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path v-if="!menuAberto" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <nav
        v-if="menuAberto"
        id="menu-mobile"
        class="border-t border-zinc-800 px-4 py-4 md:hidden"
        aria-label="Navegação móvel"
      >
        <div class="mx-auto flex max-w-screen-2xl flex-col gap-2">
          <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="rounded-lg px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800" @click="menuAberto = false">
            {{ link.label }}
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn, isDeveloper } = useAuth()
const route = useRoute()
const menuAberto = ref(false)
const links = computed(() => [
  { to: '/', label: 'Início' },
  { to: '/explorar', label: 'Explorar' },
  { to: '/como-funciona', label: 'Como funciona' },
  ...(isLoggedIn.value
    ? [
        ...(isDeveloper.value ? [{ to: '/area-dev', label: 'Área DEV' }] : []),
        { to: '/perfil', label: 'Meu perfil' }
      ]
    : [{ to: '/login', label: 'Login / Cadastro' }])
])
watch(() => route.fullPath, () => { menuAberto.value = false })
</script>
