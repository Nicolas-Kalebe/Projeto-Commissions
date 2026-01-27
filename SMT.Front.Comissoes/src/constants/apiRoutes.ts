const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5260"

export const API_ROUTES = {
  Auth: {
    validarTokenGoogle: `${API_BASE_URL}/api/Auth/ValidarTokenGoogle`,
  },
  Usuario: {
    cadastrarUsuario: `${API_BASE_URL}/api/Usuario/Cadastrar`,
    obterStatusUsuario: `${API_BASE_URL}/api/Usuario/ObterStatusUsuario`
  },
} as const
