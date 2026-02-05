using SMT.Back.Comissoes.Models.Enum;
using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.DTO.Input.Usuario
{
    public class AtualizarPerfilUsuarioInput
    
    {
        [Required]
        public string TokenGoogle { get; set; }
        public string? NomePerfil { get; set; }
        public string? Bio { get; set; }
        public PronomeEnum? Pronome { get; set; }
    }
}
