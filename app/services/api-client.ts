import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

const API_BASE_URL = '/api/backend'
const API_TIMEOUT_MS = 10_000

type ApiRequestOptions = NitroFetchOptions<NitroFetchRequest>

interface ApiErrorPayload {
  detail?: string
  message?: string
  error?: string
}

interface FetchErrorLike {
  data?: ApiErrorPayload
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

      if (status === 401) session.value = null

      const message = fetchError.data?.detail
        ?? fetchError.data?.message
        ?? fetchError.data?.error
        ?? 'Falha ao comunicar com o backend.'

      throw new ApiServiceError(message, status)
    }
  }

  return { request }
}
