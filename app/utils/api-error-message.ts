type AuthErrorContext = 'login' | 'session' | 'anonymous'

const campos = new Map(Object.entries({
  nome: 'nome', email: 'e-mail', senha: 'senha', tipo: 'tipo de conta',
  titulo: 'título', descricao: 'descrição', texto: 'comentário',
  metaFinanceira: 'meta financeira', campanha: 'duração da campanha',
  dataInicio: 'data de início', dataConclusao: 'data de conclusão',
  numJogadoresMin: 'mínimo de jogadores', numJogadoresMax: 'máximo de jogadores',
  imgThumb: 'imagem de capa', imagem: 'imagem', generos: 'gêneros',
  categorias: 'categorias', plataformas: 'plataformas', plataforma: 'plataforma', valor: 'valor'
}))

// Sem códigos de erro de negócio na API, reconhecemos apenas mensagens conhecidas.
// Qualquer texto novo ou diagnóstico interno usa a orientação genérica do status.
const conflitos = new Map([
  ['E-mail já cadastrado', 'Este e-mail já está cadastrado. Entre na sua conta ou use outro e-mail.'],
  ['Plataforma já cadastrada para este jogo', 'Essa plataforma já foi adicionada ao jogo.'],
  ['Publicação já curtida por este usuário', 'Você já curtiu esta publicação.'],
  ['Comentário já curtido por este usuário', 'Você já curtiu este comentário.']
])

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function camposInvalidos (value: unknown): string[] {
  const nomes = Array.isArray(value)
    ? value.flatMap(item => isRecord(item) ? [item.field ?? item.campo] : [])
    : isRecord(value) ? Object.keys(value) : []
  return nomes.flatMap(nome => {
    const label = typeof nome === 'string' ? campos.get(nome) : undefined
    return label ? [label] : []
  })
}

export function apiErrorMessage (
  data: unknown,
  status?: number,
  authContext: AuthErrorContext = 'anonymous'
): string {
  if (status === 408 || status === 504) {
    return 'Está demorando mais que o esperado. Tente novamente em instantes.'
  }
  if (status && status >= 500) {
    return 'O serviço está temporariamente indisponível. Tente novamente em instantes.'
  }
  if (!status) {
    return 'Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.'
  }
  switch (status) {
    case 400:
    case 422: {
      const invalidos = isRecord(data)
        ? [...new Set([...camposInvalidos(data.errors), ...camposInvalidos(data.fieldErrors)])]
        : []
      return invalidos.length
        ? `Confira os seguintes campos e tente novamente: ${invalidos.join(', ')}.`
        : 'Confira os dados preenchidos e tente novamente.'
    }
    case 401:
      if (authContext === 'session') return 'Sua sessão expirou. Entre novamente para continuar.'
      return authContext === 'login'
        ? 'E-mail ou senha incorretos. Confira seus dados e tente novamente.'
        : 'Entre na sua conta para continuar.'
    case 403: return 'Você não tem permissão para realizar esta ação.'
    case 404: return 'Este conteúdo não está disponível. Ele pode ter sido removido.'
    case 409: {
      const detalhes = isRecord(data) ? [data.detail, data.message, data.error, data.title] : [data]
      for (const detalhe of detalhes) {
        const mensagem = typeof detalhe === 'string' ? conflitos.get(detalhe.trim()) : undefined
        if (mensagem) return mensagem
      }
      return 'Não foi possível concluir porque os dados entram em conflito com um registro existente. Atualize a página e confira as informações.'
    }
    case 413: return 'O conteúdo enviado é muito grande. Reduza o tamanho e tente novamente.'
    case 429: return 'Você fez várias tentativas em pouco tempo. Aguarde um momento e tente novamente.'
    default: return 'Não foi possível concluir esta ação. Tente novamente em instantes.'
  }
}
