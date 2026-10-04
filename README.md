# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Configuração do ambiente

Crie `.env` na raiz do frontend, ao lado de `package.json`, usando `.env.example`
como modelo. Configure:

- `NUXT_PORT`: porta do frontend em desenvolvimento.
- `NUXT_BACKEND_BASE`: URL base da API, lida somente no servidor pelo proxy.
- `NUXT_PUBLIC_AVATAR_BASE`: endpoint de geração de avatares, público no navegador.

Os endereços dos serviços não têm fallback no código. Configuração ausente ou
inválida produz erro; o proxy não escolhe outro backend. As chamadas do navegador
usam `/api/backend`, uma rota relativa que acompanha o domínio e a porta do frontend.

O Nuxt lê `.env` durante o desenvolvimento. Em produção, forneça as variáveis no
ambiente do serviço; o servidor compilado não carrega `.env` automaticamente.

## Development Server

Start the development server using the port configured by `NUXT_PORT` in `.env`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Testes

Com as dependências instaladas, prepare o Chromium uma vez e execute a suíte:

```bash
npx playwright install chromium
npm test
```

O teste abre a home real em dez larguras de 390 a 1920px e compara as margens
internas do cabeçalho, dos carrosséis e das postagens, com tolerância de 1px.
Ele também exige CSS carregado e ausência de rolagem horizontal da página.

O Playwright inicia e encerra o Nuxt e uma API com dados sintéticos locais; não
usa a API publicada nem credenciais. As portas locais 4317 e 4318 precisam
estar livres. Falhas geram screenshot e trace em `test-results/`.

Para verificar somente a configuração das URLs, sem navegador:

```bash
npm test -- tests/e2e/environment-urls.spec.ts
```

Esses testes verificam o proxy e os avatares no HTML gerado pelo Nuxt, além de
configuração ausente ou inválida, prefixos da API e parâmetros dos avatares.
O ambiente de teste usa serviços sintéticos locais definidos pelo Playwright.
