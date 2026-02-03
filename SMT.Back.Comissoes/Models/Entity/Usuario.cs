using SMT.Back.Comissoes.Models.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public bool JaAnunciou { get; set; } = false; // Indica se o usuário já anunciou
        [Required]
        public DateOnly DataNascimento { get; set; } // Data de nascimento do usuário
        [Required]
        public string Email { get; set; } = string.Empty; // Email do usuário
        public int? Celular { get; set; } // Número de celular do usuário
        public string? FotoPerfil { get; set; } // Url da foto de perfil do usuário (opcional)
        public string? FotoCapa { get; set; } // Url da foto de capa do usuário (opcional)
        public string? Bio { get; set; } // Biografia do usuário (opcional)
        [Required]
        public DateTime DataCriacao { get; set; } // Data de criação do registro
        public DateTime? DataAtualizacao { get; set; } // Data da última atualização do registro (opcional)
        public StatusEnum Status { get; set; } = StatusEnum.Ativo; // Status do usuário (Ativo ou Inativo)
        [NotMapped]
        public int Seguidores { get; set; }
        public ICollection<Interacao> Interacoes { get; set; }
        public ICollection<RedeSocial> RedesSociais { get; set; } = new List<RedeSocial>();
    }
}
