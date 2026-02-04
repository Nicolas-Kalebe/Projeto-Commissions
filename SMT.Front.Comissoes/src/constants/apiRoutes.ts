const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100"

export const API_ROUTES = {
  Auth: {
    validarTokenGoogle: `${API_BASE_URL}/api/Auth/ValidarTokenGoogle`,
  },
  Usuario: {
    cadastrarUsuario: `${API_BASE_URL}/api/Usuario/Cadastrar`,
    obterStatusUsuario: `${API_BASE_URL}/api/Usuario/ObterStatusUsuario`,
    obterUsuarioPorToken: `${API_BASE_URL}/api/Usuario/ObterUsuarioPorToken`,
    obterPerfilArtista: `${API_BASE_URL}/api/Usuario/ObterPerfilArtista`,
    atualizarFotoUsuario: `${API_BASE_URL}/api/Usuario/AtualizarFotoUsuario`,
    cadastrarPortfolio: `${API_BASE_URL}/api/Usuario/CadastrarPortfolio`,
  },
  Interacao: {
    curtirPortfolio: `${API_BASE_URL}/api/Interacao/CurtirPortfolio`,
    favoritar: `${API_BASE_URL}/api/Interacao/Favoritar`,
    desfavoritar: `${API_BASE_URL}/api/Interacao/Desfavoritar`,
  },
} as const
