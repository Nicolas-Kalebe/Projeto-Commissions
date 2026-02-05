using SMT.Back.Comissoes.DTO.Input.Usuario;
using SMT.Back.Comissoes.DTO.Input.UsuarioController;
using SMT.Back.Comissoes.DTO.Output.Usuario;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface IUsuarioService
    {
        Task CadastrarUsuario(CadastrarUsuarioInput usuarioInput);
        Task<StatusEnum> ObterStatusUsuario(ValidarUsuarioGoogleInput obterStatusInput);
        Task<ObterUsuarioOutput> ObterUsuarioPorToken(ValidarUsuarioGoogleInput obterTokenGoogleInput);
        Task<AtualizarPerfilUsuarioOutput> AtualizarPerfilUsuario(AtualizarPerfilUsuarioInput atualizarPerfilUsuarioInput);
        Task<string> AtualizarFotoUsuario(AtualizarFotoUsuarioInput atualizarFotoUsuarioInput);
        Task AtualizarRedesSociais(AtualizarRedesSociaisInput atualizarRedesSociaisInput);
        Task CadastrarArtista(CadastrarArtistaInput cadastrarArtistaInput);
        Task<ObterPerfilArtistaOutput> ObterPerfilArtista(ValidarUsuarioGoogleInput obterArtistaInput);
        Task CadastrarPortfolioAsync(CadastrarPortfolioInput atualizarPortfolioInput);

    }
}