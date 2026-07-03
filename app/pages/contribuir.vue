<template>
  <div class="min-h-screen bg-dark">
    <div class="mx-auto max-w-2xl px-6 py-12 sm:px-8">
      <NuxtLink
        :to="jogoId ? `/jogo/${jogoId}` : '/'"
        class="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-white"
      >
        ← Voltar
      </NuxtLink>

      <div class="rounded-xl border border-zinc-700 bg-zinc-900/50 p-8">
        <!-- Estado: formulário -->
        <template v-if="estado === 'form'">
          <h1 class="text-2xl font-bold text-white">
            Contribuir para a campanha
          </h1>
          <p v-if="jogoTitulo" class="mt-2 text-lg text-primary">
            {{ jogoTitulo }}
          </p>
          <p v-else class="mt-2 text-sm text-zinc-500">
            Nenhum jogo selecionado. Volte à página do jogo e clique em Contribuir.
          </p>

          <template v-if="jogoId">
            <div class="mt-8">
              <p class="text-sm font-medium text-white">
                Escolha o valor da contribuição
              </p>
              <div class="mt-3 flex flex-wrap gap-3">
                <button
                  v-for="v in valoresPredefinidos"
                  :key="v"
                  type="button"
                  :class="[
                    'rounded-lg border px-5 py-2.5 text-sm font-medium transition',
                    valorSelecionado === v
                      ? 'border-primary bg-primary text-dark'
                      : 'border-zinc-600 bg-zinc-800 text-white hover:border-zinc-500'
                  ]"
                  @click="selecionarValor(v)"
                >
                  R$ {{ v }}
                </button>
              </div>
              <div class="mt-3 flex items-center gap-3">
                <label for="outro-valor" class="text-sm text-white">Outro valor (R$):</label>
                <input
                  id="outro-valor"
                  v-model.number="valorCustom"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ex: 150"
                  class="w-28 rounded-lg border border-zinc-700 bg-surface px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none"
                  @input="valorSelecionado = null"
                >
              </div>
            </div>

            <div class="mt-8 border-t border-zinc-700 pt-8">
              <p class="text-sm font-medium text-white">
                Dados do cartão
              </p>
              <form class="mt-4 space-y-4" @submit.prevent="confirmar">
                <div>
                  <label for="card-number" class="block text-sm text-zinc-400">Número do cartão</label>
                  <input
                    id="card-number"
                    v-model="cartao.numero"
                    type="text"
                    maxlength="19"
                    placeholder="0000 0000 0000 0000"
                    class="mt-1 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none"
                    @input="formatarNumeroCartao"
                  >
                </div>
                <div>
                  <label for="card-name" class="block text-sm text-zinc-400">Nome no cartão</label>
                  <input
                    id="card-name"
                    v-model="cartao.nome"
                    type="text"
                    placeholder="Nome como está no cartão"
                    class="mt-1 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none"
                  >
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="card-expiry" class="block text-sm text-zinc-400">Validade (MM/AA)</label>
                    <input
                      id="card-expiry"
                      v-model="cartao.validade"
                      type="text"
                      maxlength="5"
                      placeholder="MM/AA"
                      class="mt-1 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none"
                      @input="formatarValidade"
                    >
                  </div>
                  <div>
                    <label for="card-cvv" class="block text-sm text-zinc-400">CVV</label>
                    <input
                      id="card-cvv"
                      v-model="cartao.cvv"
                      type="text"
                      maxlength="4"
                      placeholder="123"
                      class="mt-1 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none"
                    >
                  </div>
                </div>

                <p v-if="erro" class="text-sm text-red-400">
                  {{ erro }}
                </p>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full rounded-lg bg-primary py-3 text-base font-bold uppercase tracking-wide text-dark transition hover:bg-primary/90 disabled:opacity-50"
                >
                  Confirmar contribuição
                </button>
              </form>
            </div>
          </template>
        </template>

        <!-- Estado: processando -->
        <template v-else-if="estado === 'processing'">
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p class="mt-6 text-lg font-medium text-white">
              Processando sua contribuição...
            </p>
            <p class="mt-2 text-sm text-zinc-400">
              Aguarde um momento.
            </p>
          </div>
        </template>

        <!-- Estado: sucesso -->
        <template v-else-if="estado === 'success'">
          <div class="flex flex-col items-center py-8 text-center">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-4xl">
              ✓
            </div>
            <h2 class="mt-6 text-2xl font-bold text-white">
              Parabéns, você contribuiu!
            </h2>
            <p class="mt-2 text-zinc-400">
              Sua contribuição de <strong class="text-primary">{{ valorContribuidoFormatado }}</strong> para <strong class="text-white">{{ jogoTitulo }}</strong> foi registrada com sucesso.
            </p>
            <p class="mt-4 text-sm text-zinc-500">
              Obrigado por apoiar este projeto.
            </p>
            <NuxtLink
              :to="`/jogo/${jogoId}`"
              class="mt-10 w-full rounded-lg bg-primary py-3 text-center text-base font-bold uppercase tracking-wide text-dark transition hover:bg-primary/90"
            >
              Voltar à página do jogo
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO(API): buscar o jogo selecionado pelo ID na API em vez de consultar o catálogo local.

import { jogos } from '~/data/jogos'

type EstadoContribuicao = 'form' | 'processing' | 'success'

const TEMPO_PROCESSAMENTO_MS = 3500

const route = useRoute()
const { addContribuicao } = useContribuicoes()
const valoresPredefinidos = [25, 50, 100]
const valorSelecionado = ref<number | null>(50)
const valorCustom = ref<number | ''>('')
const jogoId = computed(() => (route.query.jogo as string) || '')
const jogoTitulo = computed(() => jogos.find(jogo => jogo.id === jogoId.value)?.title ?? '')
const cartao = ref({ numero: '', nome: '', validade: '', cvv: '' })
const erro = ref('')
const loading = ref(false)
const estado = ref<EstadoContribuicao>('form')
const valorContribuido = ref(0)
const valorContribuidoFormatado = computed(() =>
  valorContribuido.value > 0 ? `R$ ${valorContribuido.value.toLocaleString('pt-BR')}` : ''
)

function selecionarValor (valor: number) {
  valorSelecionado.value = valor
  valorCustom.value = ''
}

function formatarNumeroCartao () {
  const numero = cartao.value.numero.replace(/\D/g, '').slice(0, 16)
  cartao.value.numero = numero.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function formatarValidade () {
  const validade = cartao.value.validade.replace(/\D/g, '')
  cartao.value.validade = validade.length >= 2
    ? `${validade.slice(0, 2)}/${validade.slice(2, 4)}`
    : validade
}

function valorFinal (): number {
  if (valorSelecionado.value !== null) return valorSelecionado.value
  const valor = Number(valorCustom.value)
  return Number.isFinite(valor) && valor > 0 ? valor : 0
}

function validarCartao (): boolean {
  if (cartao.value.numero.replace(/\s/g, '').length < 13) {
    erro.value = 'Número do cartão inválido.'
    return false
  }
  if (!cartao.value.nome.trim()) {
    erro.value = 'Informe o nome no cartão.'
    return false
  }
  if (!/^\d{2}\/\d{2}$/.test(cartao.value.validade)) {
    erro.value = 'Validade deve ser MM/AA.'
    return false
  }
  if (cartao.value.cvv.length < 3) {
    erro.value = 'Informe o CVV (3 ou 4 dígitos).'
    return false
  }
  return true
}

function confirmar () {
  erro.value = ''
  const valor = valorFinal()
  if (valor <= 0) {
    erro.value = 'Escolha um valor ou informe outro valor.'
    return
  }
  if (!validarCartao()) return

  loading.value = true
  estado.value = 'processing'
  addContribuicao(jogoId.value, valor)
  valorContribuido.value = valor

  setTimeout(() => {
    loading.value = false
    estado.value = 'success'
  }, TEMPO_PROCESSAMENTO_MS)
}
</script>
