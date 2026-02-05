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
    atualizarPerfilUsuario: `${API_BASE_URL}/api/Usuario/AtualizarPerfilUsuario`,
    atualizarPerfilArtista: `${API_BASE_URL}/api/Usuario/AtualizarPerfilArtista`,
    atualizarFotoUsuario: `${API_BASE_URL}/api/Usuario/AtualizarFotoUsuario`,
    atualizarRedesSociais: `${API_BASE_URL}/api/Usuario/AtualizarRedesSociais`,
    cadastrarPortfolio: `${API_BASE_URL}/api/Usuario/CadastrarPortfolio`,
  },
  Interacao: {
    curtir: `${API_BASE_URL}/api/Interacao/Curtir`,
    descurtir: `${API_BASE_URL}/api/Interacao/Descurtir`,
    salvar: `${API_BASE_URL}/api/Interacao/Salvar`,
    removerSalvamento: `${API_BASE_URL}/api/Interacao/RemoverSalvamento`,
  },
} as const
