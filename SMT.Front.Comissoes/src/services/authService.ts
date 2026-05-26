import { API_ROUTES } from "@/constants/apiRoutes"
import { api } from "@/lib/apiClient"
import { clearAuth, getAuth, setAuth, type AuthStorage, type AuthUser } from "@/lib/authStorage"

type AuthResponse = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  usuario: AuthUser
}

type PronomeEnum = number

export type CadastrarPayload = {
  email: string
  senha: string
  nomePerfil: string
  dataNascimento: string // ISO yyyy-MM-dd
  pronome?: PronomeEnum
}

export type ConfirmarEmailPayload = {
  email: string
  codigo: string
}

export type LoginLocalPayload = {
  email: string
  senha: string
}

const persistAuth = (response: AuthResponse): AuthStorage => {
  const storage: AuthStorage = {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    accessTokenExpiresAt: Date.now() + response.expiresIn * 1000,
    user: response.usuario,
  }
  setAuth(storage)
  return storage
}

export const authService = {
  async cadastrar(payload: CadastrarPayload): Promise<void> {
    await api.post(API_ROUTES.Auth.cadastrar, payload, { skipAuth: true })
  },

  async confirmarEmail(payload: ConfirmarEmailPayload): Promise<AuthStorage> {
    const response = await api.post<AuthResponse>(
      API_ROUTES.Auth.confirmarEmail,
      payload,
      { skipAuth: true }
    )
    return persistAuth(response)
  },

  async reenviarCodigo(email: string): Promise<void> {
    await api.post(API_ROUTES.Auth.reenviarCodigo, { email }, { skipAuth: true })
  },

  async loginLocal(payload: LoginLocalPayload): Promise<AuthStorage> {
    const response = await api.post<AuthResponse>(
      API_ROUTES.Auth.loginLocal,
      payload,
      { skipAuth: true }
    )
    return persistAuth(response)
  },

  async loginGoogle(tokenGoogle: string): Promise<AuthStorage> {
    const response = await api.post<AuthResponse>(
      API_ROUTES.Auth.validarTokenGoogle,
      { tokenGoogle },
      { skipAuth: true }
    )
    return persistAuth(response)
  },

  async logout(): Promise<void> {
    const current = getAuth()
    try {
      if (current) {
        await api.post(API_ROUTES.Auth.logout, { refreshToken: current.refreshToken })
      }
    } catch {
      // ignore — sempre desloga local
    } finally {
      clearAuth()
    }
  },
}
