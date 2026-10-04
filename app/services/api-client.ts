import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import { apiErrorMessage } from '../utils/api-error-message'

const API_BASE_URL = '/api/backend'
const API_TIMEOUT_MS = 10_000

type ApiRequestOptions = NitroFetchOptions<NitroFetchRequest>

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

      const authContext = tinhaSessao ? 'session' : path === '/auth/login' ? 'login' : 'anonymous'
      const message = apiErrorMessage(fetchError.data, status, authContext)

      throw new ApiServiceError(message, status)
    }
  }

  return { request }
}
