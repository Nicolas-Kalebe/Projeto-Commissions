using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.DTO.Input.Auth
{
    public class LogoutInput
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
