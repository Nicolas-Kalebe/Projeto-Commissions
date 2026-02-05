using SMT.Back.Comissoes.Models.Enum;
using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.DTO.Input.UsuarioController
{
    public class CadastrarUsuarioInput
    {

        [Required]
        public string NomePerfil { get; set; } = string.Empty; // Nome de perfil do usuário (@)

        [Required]
        public DateOnly DataNascimento { get; set; } // Data de nascimento do usuário
        [Required]
        public string TokenGoogle { get; set; } = string.Empty; // Token Google do usuário
        public PronomeEnum? Pronome { get; set; }
        }
}
