using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.DTO.Input.UsuarioController
{
    public class AtualizarFotoUsuarioInput
    {
        public IFormFile FotoPerfil { get; set; } = default!;
        public TipoFotoPerfilEnum fotoPerfilEnum { get; set; }
    }
}
