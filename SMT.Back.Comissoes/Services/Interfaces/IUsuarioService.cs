using SMT.Back.Comissoes.DTO.Input;
using SMT.Back.Comissoes.Models.Entity;

namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface IUsuarioService
    {
        Task CadastrarUsuario(CadastrarUsuarioInput usuarioInput);
    }
}