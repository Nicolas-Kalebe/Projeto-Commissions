import { AUTH_PUBLIC_PATHS, API_ROUTES } from "@/constants/apiRoutes"
import { clearAuth, getAuth, setAuth, type AuthStorage } from "@/lib/authStorage"

export class ApiError extends Error {
  status: number
  codigo?: string
  payload?: unknown

  constructor(message: string, status: number, codigo?: string, payload?: unknown) {
    super(message)
    this.status = status
    this.codigo = codigo
    this.payload = payload
  }
}

type RetornoPadrao<T> = {
  codigo?: string
  Codigo?: string
  mensagem?: string
  Mensagem?: string
  statusHttp?: number
  StatusHttp?: number
  resultado?: T
  Resultado?: T
}

const getCodigoFromRetorno = (r: RetornoPadrao<unknown> | null): string | undefined =>
  r?.codigo ?? r?.Codigo

const getMensagemFromRetorno = (r: RetornoPadrao<unknown> | null): string | undefined =>
  r?.mensagem ?? r?.Mensagem

const getResultadoFromRetorno = <T>(r: RetornoPadrao<T> | null): T | undefined =>
  (r?.resultado ?? r?.Resultado) as T | undefined

let refreshing: Promise<AuthStorage | null> | null = null

const callRefresh = async (auth: AuthStorage): Promise<AuthStorage | null> => {
  try {
    const response = await fetch(API_ROUTES.Auth.refreshToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tokenAntigo: auth.accessToken,
        refreshTokenAntigo: auth.refreshToken,
      }),
    })
    if (!response.ok) return null
    const json = (await response.json().catch(() => null)) as RetornoPadrao<{
      accessToken: string
      refreshToken: string
      expiresIn: number
      usuario: AuthStorage["user"]
    }> | null
    const resultado = getResultadoFromRetorno(json)
    if (!resultado?.accessToken || !resultado?.refreshToken) return null
    const next: AuthStorage = {
      accessToken: resultado.accessToken,
      refreshToken: resultado.refreshToken,
      accessTokenExpiresAt: Date.now() + resultado.expiresIn * 1000,
      user: resultado.usuario ?? auth.user,
    }
    setAuth(next)
    return next
  } catch {
    return null
  }
}

const ensureRefreshed = async (auth: AuthStorage): Promise<AuthStorage | null> => {
  if (!refreshing) {
    refreshing = callRefresh(auth).finally(() => {
      refreshing = null
    })
  }
  return refreshing
}

type RequestOptions = {
  method?: string
  body?: unknown
  isFormData?: boolean
  skipAuth?: boolean
}

const buildHeaders = (options: RequestOptions, accessToken: string | null): HeadersInit => {
  const headers: Record<string, string> = {}
  if (!options.isFormData) headers["Content-Type"] = "application/json"
  if (accessToken && !options.skipAuth) headers["Authorization"] = `Bearer ${accessToken}`
  return headers
}

const buildBody = (options: RequestOptions): BodyInit | undefined => {
  if (options.body === undefined || options.body === null) return undefined
  if (options.isFormData) return options.body as FormData
  return JSON.stringify(options.body)
}

const doFetch = async (url: string, options: RequestOptions, accessToken: string | null) => {
  return fetch(url, {
    method: options.method ?? "GET",
    headers: buildHeaders(options, accessToken),
    body: buildBody(options),
  })
}

const isPublic = (url: string) => AUTH_PUBLIC_PATHS.has(url)

const parseJson = async <T>(response: Response): Promise<RetornoPadrao<T> | null> => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text) as RetornoPadrao<T>
  } catch {
    return null
  }
}

const throwApiError = async <T>(response: Response, json: RetornoPadrao<T> | null) => {
  const mensagem = getMensagemFromRetorno(json) ?? response.statusText ?? "Erro na requisicao."
  const codigo = getCodigoFromRetorno(json)
  throw new ApiError(mensagem, response.status, codigo, json)
}

const onAuthFailure = () => {
  clearAuth()
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.assign("/login")
  }
}

export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const publicEndpoint = isPublic(url) || options.skipAuth
  let auth = getAuth()

  if (!publicEndpoint && !auth) {
    onAuthFailure()
    throw new ApiError("Nao autenticado.", 401)
  }

  let response = await doFetch(url, options, auth?.accessToken ?? null)

  if (response.status === 401 && !publicEndpoint && auth) {
    const next = await ensureRefreshed(auth)
    if (!next) {
      onAuthFailure()
      const json = await parseJson<T>(response)
      await throwApiError<T>(response, json)
    }
    auth = next
    response = await doFetch(url, options, auth!.accessToken)
  }

  const json = await parseJson<T>(response)
  if (!response.ok) {
    await throwApiError<T>(response, json)
  }
  return getResultadoFromRetorno<T>(json) ?? (json as unknown as T)
}

export const api = {
  get: <T>(url: string) => request<T>(url, { method: "GET" }),
  post: <T>(url: string, body?: unknown, opts: { skipAuth?: boolean } = {}) =>
    request<T>(url, { method: "POST", body, skipAuth: opts.skipAuth }),
  patch: <T>(url: string, body?: unknown) => request<T>(url, { method: "PATCH", body }),
  delete: <T>(url: string, body?: unknown) => request<T>(url, { method: "DELETE", body }),
  postForm: <T>(url: string, form: FormData) =>
    request<T>(url, { method: "POST", body: form, isFormData: true }),
  patchForm: <T>(url: string, form: FormData) =>
    request<T>(url, { method: "PATCH", body: form, isFormData: true }),
}
