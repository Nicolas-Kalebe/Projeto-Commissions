using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<bool> VerificaUsuarioExistePorEmail(string email);
        Task<bool> VerificaUsuarioExistePorNomePerfil(string nomeUsuario);
        Task CadastrarUsuario(Usuario usuario);
        Task<StatusEnum> ObterStatusUsuario(string email);
        Task<Usuario> ObterUsuarioPorEmail(string email);
        Task<Usuario?> BuscarUsuarioPorEmail(string email);
        Task<Usuario> ObterUsuarioPorId(int id);
        Task AtualizarPerfilUsuario(Usuario usuarioAtualizado);
        Task AtualizarFotoPerfil(int usuarioId, string fotoPerfilUrl, TipoFotoPerfilEnum tipoFotoPerfilEnum);
        Task AtualizarRedesSociais(RedeSocial redesSociais);
        Task CadastrarArtista(Artista artista, int usuarioId);
        Task<Artista> ObterArtistaPorUsuarioId(int usuarioId);
        Task AtualizarPerfilArtista(Artista artista);

        Task CadastrarPortfolioArtista(int artistaId, PortfolioItem portfolioItem);
    }
}
