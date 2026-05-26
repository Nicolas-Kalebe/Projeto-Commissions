using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.DTO.Input.Auth
{
    public class ConfirmarEmailInput
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Codigo { get; set; } = string.Empty;
    }
}
