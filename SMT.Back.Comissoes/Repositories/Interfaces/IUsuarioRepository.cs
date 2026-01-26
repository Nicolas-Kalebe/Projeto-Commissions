using SMT.Back.Comissoes.Models.Entity;

namespace SMT.Back.Comissoes.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<bool> VerificaUsuarioExistePorEmail(string email);
        Task<bool> VerificaUsuarioExistePorNomePerfil(string nomeUsuario);
        Task CadastrarUsuario(Usuario usuario);
    }
}