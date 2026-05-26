using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.DTO.Input.Usuario
{
    public class AtualizarPerfilUsuarioInput
    {
        public string? NomePerfil { get; set; }
        public string? Bio { get; set; }
        public PronomeEnum? Pronome { get; set; }
    }
}
