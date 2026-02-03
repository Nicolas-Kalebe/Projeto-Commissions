using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.DTO.Input.UsuarioController
{
    public class AtualizarFotoUsuarioInput
    {
        public string TokenGoogle { get; set; }
        public IFormFile FotoPerfil { get; set; }
        public TipoFotoPerfilEnum fotoPerfilEnum { get; set; }
    }
}

