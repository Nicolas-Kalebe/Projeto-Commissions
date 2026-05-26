export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100"

export const API_ROUTES = {
  Auth: {
    cadastrar: `${API_BASE_URL}/api/Auth/Cadastrar`,
    confirmarEmail: `${API_BASE_URL}/api/Auth/ConfirmarEmail`,
    reenviarCodigo: `${API_BASE_URL}/api/Auth/ReenviarCodigo`,
    loginLocal: `${API_BASE_URL}/api/Auth/LoginLocal`,
    validarTokenGoogle: `${API_BASE_URL}/api/Auth/ValidarTokenGoogle`,
    refreshToken: `${API_BASE_URL}/api/Auth/RefreshToken`,
    logout: `${API_BASE_URL}/api/Auth/Logout`,
  },
  Usuario: {
    obterStatusUsuario: `${API_BASE_URL}/api/Usuario/ObterStatusUsuario`,
    obterMeuUsuario: `${API_BASE_URL}/api/Usuario/ObterMeuUsuario`,
    obterPerfilArtista: `${API_BASE_URL}/api/Usuario/ObterPerfilArtista`,
    atualizarPerfilUsuario: `${API_BASE_URL}/api/Usuario/AtualizarPerfilUsuario`,
    atualizarPerfilArtista: `${API_BASE_URL}/api/Usuario/AtualizarPerfilArtista`,
    atualizarFotoUsuario: `${API_BASE_URL}/api/Usuario/AtualizarFotoUsuario`,
    atualizarRedesSociais: `${API_BASE_URL}/api/Usuario/AtualizarRedesSociais`,
    cadastrarArtista: `${API_BASE_URL}/api/Usuario/CadastrarArtista`,
    cadastrarPortfolio: `${API_BASE_URL}/api/Usuario/CadastrarPortfolio`,
  },
  Interacao: {
    curtir: `${API_BASE_URL}/api/Interacao/Curtir`,
    descurtir: `${API_BASE_URL}/api/Interacao/Descurtir`,
    salvar: `${API_BASE_URL}/api/Interacao/Salvar`,
    removerSalvamento: `${API_BASE_URL}/api/Interacao/RemoverSalvamento`,
    seguir: `${API_BASE_URL}/api/Interacao/Seguir`,
    deixarDeSeguir: `${API_BASE_URL}/api/Interacao/DeixarDeSeguir`,
    avaliar: `${API_BASE_URL}/api/Interacao/Avaliar`,
  },
} as const

export const AUTH_PUBLIC_PATHS = new Set<string>([
  API_ROUTES.Auth.cadastrar,
  API_ROUTES.Auth.confirmarEmail,
  API_ROUTES.Auth.reenviarCodigo,
  API_ROUTES.Auth.loginLocal,
  API_ROUTES.Auth.validarTokenGoogle,
  API_ROUTES.Auth.refreshToken,
])
