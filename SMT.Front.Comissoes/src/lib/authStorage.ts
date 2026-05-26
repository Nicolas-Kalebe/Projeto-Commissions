export type AuthUser = {
  id: number
  nome: string
  nomePerfil: string
  email: string
  fotoPerfil?: string | null
  jaAnunciou: boolean
  provedor: "Local" | "Google"
}

export type AuthStorage = {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: number
  user: AuthUser
}

const STORAGE_KEY = "auth"
const LEGACY_KEYS = ["google_token", "google_name", "google_photo"]

type Listener = (value: AuthStorage | null) => void
const listeners = new Set<Listener>()

const cleanupLegacy = () => {
  try {
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}

export const getAuth = (): AuthStorage | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthStorage
  } catch {
    return null
  }
}

export const setAuth = (value: AuthStorage) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    cleanupLegacy()
    listeners.forEach((l) => l(value))
  } catch {
    /* ignore */
  }
}

export const clearAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    cleanupLegacy()
    listeners.forEach((l) => l(null))
  } catch {
    /* ignore */
  }
}

export const subscribeAuth = (listener: Listener) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
