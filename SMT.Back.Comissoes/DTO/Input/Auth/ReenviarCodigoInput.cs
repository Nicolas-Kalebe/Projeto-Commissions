using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.DTO.Input.Auth
{
    public class ReenviarCodigoInput
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
