export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:32770"

export const API_ROUTES = {
  Auth: {
    validarTokenGoogle: `${API_BASE_URL}/api/Auth/ValidarTokenGoogle`,
  },
} as const
