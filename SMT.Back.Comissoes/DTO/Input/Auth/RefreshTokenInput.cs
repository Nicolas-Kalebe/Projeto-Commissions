using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.DTO.Input.Auth
{
    public class RefreshTokenInput
    {
        [Required]
        public string TokenAntigo { get; set; } = string.Empty;
        [Required]
        public string RefreshTokenAntigo { get; set; } = string.Empty;
    }
}
