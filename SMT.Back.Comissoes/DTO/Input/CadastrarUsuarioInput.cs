using SMT.Back.Comissoes.Models.Enum;
using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.DTO.Input
{
    public class CadastrarUsuarioInput
    {

        [Required]
        public string Nome { get; set; } = string.Empty; // Nome completo do usuário

        [Required]
        public string NomePerfil { get; set; } = string.Empty; // Nome de perfil do usuário (@)

        public TipoUsuarioEnum? TipoUsuario { get; set; } // Tipo de usuário (Pessoa Física ou Jurídica)

        [Required]
        public DateOnly DataNascimento { get; set; } // Data de nascimento do usuário

        [Required]
        public string Email { get; set; } = string.Empty; // Email do usuário

        [Required]
        public string SenhaHash { get; set; } = string.Empty; // Hash da senha do usuário
    }
}
