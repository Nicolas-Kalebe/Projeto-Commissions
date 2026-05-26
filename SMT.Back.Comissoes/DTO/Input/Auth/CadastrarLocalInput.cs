using SMT.Back.Comissoes.Models.Enum;
using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.DTO.Input.Auth
{
    public class CadastrarLocalInput
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Senha { get; set; } = string.Empty;
        [Required]
        public string NomePerfil { get; set; } = string.Empty;
        [Required]
        public DateOnly DataNascimento { get; set; }
        public PronomeEnum? Pronome { get; set; }
    }
}
