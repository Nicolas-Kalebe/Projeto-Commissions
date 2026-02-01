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
        Task<Usuario> ObterUsuarioPorId(int id);
        Task CadastrarArtista(Artista artista);
        Task<Usuario> ObterUsuarioPorEmail(string email);
        Task<Artista> ObterArtistaPorUsuarioId(int usuarioId);
        Task AtualizarPortfolioArtista(int artistaId, string portfolioUrl);
        Task AtualizarFotoPerfil(int usuarioId, string fotoPerfilUrl);

    }
}