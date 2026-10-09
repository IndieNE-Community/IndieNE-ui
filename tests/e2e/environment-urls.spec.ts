import { expect, test } from '@playwright/test'
import { buildAvatarUrl } from '../../app/utils/avatar'
import { backendRequestUrl } from '../../server/utils/backend-url'

test('configuração do Nuxt não embute endereços de serviços', async () => {
  test.setTimeout(60_000)
  const { loadNuxtConfig } = await import('@nuxt/kit')
  const config = await loadNuxtConfig({ cwd: process.cwd(), dotenv: false })
  expect(config.runtimeConfig.backendBase).toBe('')
  expect(config.runtimeConfig.public.avatarBase).toBe('')
})

test('proxy usa o backend configurado no ambiente', async ({ request }) => {
  const response = await request.get('/api/backend/jogos')
  expect(response.status()).toBe(200)
  const data = await response.json()
  expect(data.content).toHaveLength(7)
  expect(data.content[0].titulo).toBe('Jogo de teste 1')
})

test('avatar renderizado no SSR usa o endpoint do ambiente', async ({ request }) => {
  const response = await request.get('/desenvolvedores/estudio-de-teste')
  expect(response.status()).toBe(200)
  const html = await response.text()
  const sources = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1])
  expect(sources).toContain('http://127.0.0.1:4318/avatars/svg?seed=Est%C3%BAdio+de+teste')
})

test('comentário renderizado no SSR usa o endpoint do ambiente', async ({ request }) => {
  const response = await request.get('/jogo/1')
  expect(response.status()).toBe(200)
  const html = await response.text()
  expect(html).toContain('Comentário de teste')
  const sources = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1])
  expect(sources).toContain('http://127.0.0.1:4318/avatars/svg?seed=Apoiador+00000000')
})

test('avatar do formulário de comentário usa o ambiente e preserva o nome', async ({ request }) => {
  const session = {
    token: 'token-sintetico-de-teste',
    expiresAt: Date.now() + 60_000,
    user: {
      id: '00000000-0000-4000-8000-000000000003',
      nome: ' Ana & João ', email: 'teste@example.test', tipo: 'USUARIO_COMUM'
    }
  }
  const response = await request.get('/jogo/1', {
    headers: { cookie: `indiene_auth=${encodeURIComponent(JSON.stringify(session))}` }
  })
  expect(response.status()).toBe(200)
  const html = await response.text()
  const sources = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1])
  expect(sources).toContain('http://127.0.0.1:4318/avatars/svg?seed=+Ana+%26+Jo%C3%A3o+')
})

test('backend preserva host, porta, prefixo e query da requisição', () => {
  expect(backendRequestUrl('https://backend.example.test:9443/api/', '/jogos?size=3'))
    .toBe('https://backend.example.test:9443/api/jogos?size=3')
  expect(backendRequestUrl('http://outro.example.test:9000', '/publicacoes'))
    .toBe('http://outro.example.test:9000/publicacoes')
})

test('backend sem configuração válida falha sem escolher outro endereço', () => {
  for (const base of ['', ' ', 'localhost:8080', 'file:///tmp/api', 'https://backend.example.test?token=teste',
    'https://backend.example.test/api?', 'https://backend.example.test/api#']) {
    expect(() => backendRequestUrl(base, '/jogos')).toThrow(/NUXT_BACKEND_BASE/)
  }
})

test('avatar respeita endpoint, parâmetros e seed configurados', () => {
  const url = new URL(buildAvatarUrl('https://avatars.example.test/custom/svg?size=80&seed=antigo', ' Ana & João '))
  expect(url.origin).toBe('https://avatars.example.test')
  expect(url.pathname).toBe('/custom/svg')
  expect(url.searchParams.get('size')).toBe('80')
  expect(url.searchParams.getAll('seed')).toEqual([' Ana & João '])
  expect(buildAvatarUrl('http://outro.example.test/avatar', 'Teste')).toBe('http://outro.example.test/avatar?seed=Teste')
})

test('avatar não escolhe um serviço quando a configuração está ausente ou inválida', () => {
  for (const base of ['', ' ', 'inválida', 'localhost:8080', 'file:///tmp/avatar']) {
    expect(() => buildAvatarUrl(base, 'Teste')).toThrow(/NUXT_PUBLIC_AVATAR_BASE/)
  }
})
