<template>
  <div class="min-h-screen bg-dark">
    <div class="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-12">
      <!-- Texto introdutório -->
      <div class="text-center">
        <p class="text-lg leading-relaxed text-white">
          A IndieNE é uma plataforma criada para fortalecer a cena de jogos independentes no
          Brasil, aproximando criadores e jogadores em um ecossistema justo, acessível e
          totalmente focado na comunidade. Nosso propósito é dar visibilidade a desenvolvedores
          indie, oferecendo um espaço onde eles possam divulgar seus projetos, vender seus jogos e
          captar recursos sem depender de grandes distribuidoras, burocracias ou taxas abusivas.
        </p>
      </div>

      <!-- Destaque em verde -->
      <div class="mt-10 rounded-xl bg-primary p-8">
        <p class="text-center text-lg font-medium leading-relaxed text-dark">
          Aqui, cada desenvolvedor mantém controle total sobre seu trabalho, enquanto os jogadores têm acesso a títulos criativos, originais e produzidos com paixão.
        </p>
      </div>

      <!-- Seção: Como funciona o financiamento coletivo -->
      <div class="mt-16 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <!-- Imagem ilustrativa -->
        <div class="shrink-0 overflow-hidden rounded-xl bg-zinc-800 lg:w-2/5">
          <img
            src="/images/financiamento-coletivo.jpg"
            alt="Ilustração: financiamento coletivo"
            class="aspect-[4/5] w-full object-cover"
          >
        </div>

        <!-- Texto e lista -->
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-tight text-white lg:text-3xl">
            Como funciona o financiamento coletivo na IndieNE
          </h2>
          <p class="mt-6 text-base leading-relaxed text-white">
            O sistema de financiamento colaborativo da IndieNE permite que qualquer pessoa apoie diretamente o desenvolvimento de jogos independentes. O processo funciona de maneira transparente e segura:
          </p>
          <ul class="mt-6 space-y-4">
            <li
              v-for="(item, idx) in passos"
              :key="idx"
              class="flex gap-3 text-base leading-relaxed text-white"
            >
              <span class="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-primary" aria-hidden="true" />
              <span>{{ item }}</span>
            </li>
          </ul>
          <p class="mt-8 text-base leading-relaxed text-white">
            Com esse modelo, a IndieNE promove um ambiente colaborativo onde ideias ganham vida com o apoio direto da comunidade, permitindo que mais jogos independentes alcancem seu potencial e encontrem seu público.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const passos = [
  'O desenvolvedor cria uma campanha',
  'O jogador escolhe um projeto para apoiar',
  'Apoiar é simples e seguro',
  'A doação é registrada automaticamente',
  'Transparência e atualização contínua'
]

</script>
