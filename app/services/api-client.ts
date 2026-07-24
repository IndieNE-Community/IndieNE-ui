import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

const API_BASE_URL = '/api/backend'
const API_TIMEOUT_MS = 10_000

type ApiRequestOptions = NitroFetchOptions<NitroFetchRequest>

interface ApiErrorPayload {
  detail?: string
  message?: string
  error?: string
  title?: string
  errors?: unknown
  fieldErrors?: unknown
}

interface FetchErrorLike {
  data?: unknown
  response?: { status?: number }
  status?: number
  statusCode?: number
}

export interface HttpServiceClient {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>
}

function asFetchError (error: unknown): FetchErrorLike {
  return typeof error === 'object' && error !== null ? error as FetchErrorLike : {}
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function textoNaoVazio (value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function mensagensDeValidacao (value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === 'string') return [item]
      if (!isRecord(item)) return []
      const campo = textoNaoVazio(item.field) ?? textoNaoVazio(item.campo)
      const mensagem = textoNaoVazio(item.defaultMessage) ?? textoNaoVazio(item.message) ?? textoNaoVazio(item.mensagem)
      return mensagem ? [`${campo ? `${campo}: ` : ''}${mensagem}`] : []
    })
  }

  if (isRecord(value)) {
    return Object.entries(value).flatMap(([campo, mensagem]) => {
      const texto = textoNaoVazio(mensagem)
      return texto ? [`${campo}: ${texto}`] : []
    })
  }

  return []
}

function mensagemPorStatus (status?: number): string {
  switch (status) {
    case 400: return 'Os dados enviados são inválidos.'
    case 401: return 'E-mail ou senha inválidos.'
    case 403: return 'Você não tem permissão para realizar esta operação.'
    case 404: return 'O recurso solicitado não foi encontrado.'
    case 409: return 'Já existe um registro com esses dados.'
    case 422: return 'Não foi possível validar os dados enviados.'
    case 429: return 'Muitas tentativas. Aguarde um momento e tente novamente.'
    default:
      return status && status >= 500
        ? 'O backend encontrou um erro ao processar a solicitação.'
        : 'Não foi possível comunicar com o backend.'
  }
}

function extrairMensagemErro (data: unknown, status?: number): string {
  const textoDireto = textoNaoVazio(data)
  if (textoDireto) return textoDireto
  if (!isRecord(data)) return mensagemPorStatus(status)

  const payload = data as ApiErrorPayload
  const validacoes = [
    ...mensagensDeValidacao(payload.errors),
    ...mensagensDeValidacao(payload.fieldErrors)
  ]
  if (validacoes.length) return validacoes.join(' ')

  return textoNaoVazio(payload.detail)
    ?? textoNaoVazio(payload.message)
    ?? textoNaoVazio(payload.error)
    ?? textoNaoVazio(payload.title)
    ?? mensagemPorStatus(status)
}

export class ApiServiceError extends Error {
  constructor (message: string, public readonly status?: number) {
    super(message)
    this.name = 'ApiServiceError'
  }
}

export function useApiClient (): HttpServiceClient {
  const session = useAuthSession()

  async function request<T> (path: string, options: ApiRequestOptions = {}): Promise<T> {
    const tinhaSessao = Boolean(session.value?.token)
    const headers = new Headers(options.headers)
    if (session.value?.token) headers.set('Authorization', `Bearer ${session.value.token}`)

    try {
      return await $fetch<T>(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        timeout: API_TIMEOUT_MS
      })
    } catch (error: unknown) {
      const fetchError = asFetchError(error)
      const status = fetchError.response?.status ?? fetchError.statusCode ?? fetchError.status

      if (status === 401 && tinhaSessao) {
        session.value = null
        if (import.meta.client) await navigateTo({ path: '/login', query: { motivo: 'sessao-expirada' } })
      }

      const message = extrairMensagemErro(fetchError.data, status)

      throw new ApiServiceError(message, status)
    }
  }

  return { request }
}
