import { expect, test } from '@playwright/test'
import { apiErrorMessage } from '../../app/utils/api-error-message'

test('falhas técnicas nunca repassam texto do servidor, mesmo em campos de validação', () => {
  const diagnostic = 'SQL java.lang.Exception <html>Bad Gateway</html> internal.example.test'
  const payloads = [diagnostic, { detail: diagnostic }, { message: diagnostic },
    { error: diagnostic }, { title: diagnostic }, { errors: [diagnostic] },
    { fieldErrors: { [diagnostic]: diagnostic } }, null, ['Bad Gateway']]
  for (const status of [undefined, 0, 400, 401, 403, 404, 408, 409, 413, 418, 422, 429, 500, 502, 503, 504]) {
    for (const payload of payloads) {
      expect(apiErrorMessage(payload, status)).not.toMatch(/SQL|Exception|html|Gateway|internal\.example|backend/)
    }
  }
})

test('falha sem resposta orienta sobre conexão sem afirmar que a internet caiu', () => {
  expect(apiErrorMessage({ message: 'fetch failed' })).toBe(
    'Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.')
})

test('login, sessão expirada e acesso anônimo têm orientações distintas', () => {
  expect(apiErrorMessage(null, 401, 'login')).toBe('E-mail ou senha incorretos. Confira seus dados e tente novamente.')
  expect(apiErrorMessage(null, 401, 'session')).toBe('Sua sessão expirou. Entre novamente para continuar.')
  expect(apiErrorMessage(null, 401)).toBe('Entre na sua conta para continuar.')
})

test('validação mostra nomes amigáveis de campos sem expor mensagens internas', () => {
  expect(apiErrorMessage({
    errors: [{ field: 'email', defaultMessage: 'must be a well-formed email address' },
      { campo: 'metaFinanceira', mensagem: 'must be greater than 0' }],
    fieldErrors: { email: 'Invalid', senha: 'Size', 'internal.field': 'java.lang.Exception' }
  }, 400)).toBe('Confira os seguintes campos e tente novamente: e-mail, meta financeira, senha.')
  expect(apiErrorMessage({ errors: ['Validation failed'] }, 422))
    .toBe('Confira os dados preenchidos e tente novamente.')
})

test('conflitos conhecidos preservam a orientação de negócio', () => {
  for (const key of ['detail', 'message', 'error', 'title']) {
    expect(apiErrorMessage({ [key]: 'E-mail já cadastrado' }, 409))
      .toBe('Este e-mail já está cadastrado. Entre na sua conta ou use outro e-mail.')
  }
  expect(apiErrorMessage('Publicação já curtida por este usuário', 409)).toBe('Você já curtiu esta publicação.')
  expect(apiErrorMessage({ message: 'Comentário já curtido por este usuário' }, 409)).toBe('Você já curtiu este comentário.')
  expect(apiErrorMessage({ detail: 'Plataforma já cadastrada para este jogo' }, 409)).toBe('Essa plataforma já foi adicionada ao jogo.')
  expect(apiErrorMessage({ message: 'E-mail já cadastrado' }, 503)).toContain('temporariamente indisponível')
})

test('permissão, conteúdo ausente, excesso de tentativas e tamanho recebem orientação própria', () => {
  expect(apiErrorMessage(null, 403)).toContain('permissão')
  expect(apiErrorMessage(null, 404)).toContain('conteúdo não está disponível')
  expect(apiErrorMessage(null, 429)).toContain('Aguarde um momento')
  expect(apiErrorMessage(null, 413)).toContain('Reduza o tamanho')
  expect(apiErrorMessage(null, 408)).toContain('demorando mais que o esperado')
})

for (const status of [500, 502, 503, 504, 599]) {
  test(`página de jogo apresenta orientação amigável na falha ${status}`, async ({ request }) => {
    const response = await request.get(`/jogo/${status}`)
    expect(response.status()).toBe(200)
    const html = await response.text()
    const messages = [...html.matchAll(/<p\b[^>]*>([^<]+)<\/p>/g)].map(match => match[1])
    expect(messages).toContain(status === 504
      ? 'Está demorando mais que o esperado. Tente novamente em instantes.'
      : 'O serviço está temporariamente indisponível. Tente novamente em instantes.')
    expect(html).not.toMatch(/Bad Gateway|ECONNREFUSED|internal\.example\.test|Internal Server Error/)
  })
}
