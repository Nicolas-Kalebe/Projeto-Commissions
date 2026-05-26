using SMT.Back.Comissoes.DTO.Input.Usuario;
using SMT.Back.Comissoes.DTO.Input.UsuarioController;
using SMT.Back.Comissoes.DTO.Output.Usuario;
using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface IUsuarioService
    {
        Task<StatusEnum> ObterStatusUsuario();
        Task<ObterUsuarioOutput> ObterMeuUsuario();
        Task<AtualizarPerfilUsuarioOutput> AtualizarPerfilUsuario(AtualizarPerfilUsuarioInput input);
        Task<string> AtualizarFotoUsuario(AtualizarFotoUsuarioInput input);
        Task AtualizarRedesSociais(AtualizarRedesSociaisInput input);
        Task CadastrarArtista(CadastrarArtistaInput input);
        Task<ObterPerfilArtistaOutput> ObterPerfilArtista();
        Task<AtualizarPerfilArtistaOutput> AtualizarPerfilArtista(AtualizarPerfilArtistaInput input);
        Task CadastrarPortfolioAsync(CadastrarPortfolioInput input);
    }
}
