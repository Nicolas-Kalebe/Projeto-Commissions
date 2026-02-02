using SMT.Back.Comissoes.DTO.Input.UsuarioController;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface IUsuarioService
    {
        Task CadastrarUsuario(CadastrarUsuarioInput usuarioInput);
        Task<StatusEnum> ObterStatusUsuario(ObterStatusInput obterStatusInput);
        Task CadastrarArtista(CadastrarArtistaInput cadastrarArtistaInput);
        Task<Artista> ObterPerfilArtista(ObterArtistaInput obterArtistaInput);
        Task AtualizarPortfolioAsync(AtualizarPortfolioInput atualizarPortfolioInput);
        Task<string> AtualizarFotoUsuario(AtualizarFotoUsuarioInput atualizarFotoUsuarioInput);
        Task<Usuario> ObterUsuarioPorToken(ObterTokenGoogleInput obterTokenGoogleInput);

    }
}