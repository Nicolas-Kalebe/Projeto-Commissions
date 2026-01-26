using SMT.Back.Comissoes.Models.Enum;
using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; } // Primary Key

        [Required]
        public string Nome { get; set; } = string.Empty; // Nome completo do usuário

        [Required]
        public string NomePerfil { get; set; } = string.Empty; // Nome de perfil do usuário (@)

        public string? CpfCnpj { get; set; } // CPF ou CNPJ do usuário (opcional)

        public TipoUsuarioEnum? TipoUsuario { get; set; } // Tipo de usuário (Pessoa Física ou Jurídica)

        public bool JaAnunciou { get; set; } = false; // Indica se o usuário já anunciou

        [Required]
        public DateOnly DataNascimento { get; set; } // Data de nascimento do usuário

        [Required]
        public string Email { get; set; } = string.Empty; // Email do usuário
        public int? Celular { get; set; } // Número de celular do usuário

        [Required]
        public string SenhaHash { get; set; } = string.Empty; // Hash da senha do usuário

        [Required]
        public DateTime DataCriacao { get; set; } // Data de criação do registro

        public DateTime? DataAtualizacao { get; set; } // Data da última atualização do registro (opcional)

        public StatusEnum Status { get; set; } = StatusEnum.Ativo; // Status do usuário (Ativo ou Inativo)
    }
}