using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.DTO.Input.Auth
{
    public class ValidarTokenGoogleAuthInput
    {
        [Required]
        public string TokenGoogle { get; set; } = string.Empty;
    }
}
