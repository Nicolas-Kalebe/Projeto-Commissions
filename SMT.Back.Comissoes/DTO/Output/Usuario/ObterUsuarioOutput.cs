using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SMT.Back.Comissoes.DTO.Output.Usuario
{
    public class ObterUsuarioOutput
    {
        public int Id { get; set; } // Primary Key
        public string Nome { get; set; } = string.Empty; // Nome completo do usuário
        public string NomePerfil { get; set; } = string.Empty; // Nome de perfil do usuário (@)
        public bool JaAnunciou { get; set; } = false; // Indica se o usuário já anunciou
        public DateOnly DataNascimento { get; set; } // Data de nascimento do usuário
        public string Email { get; set; } = string.Empty; // Email do usuário
        public int? Celular { get; set; } // Número de celular do usuário
        public string? FotoPerfil { get; set; } // Url da foto de perfil do usuário (opcional)
        public string? FotoCapa { get; set; } // Url da foto de capa do usuário (opcional)
        public string? Bio { get; set; } // Biografia do usuário (opcional)
        public DateTime DataCriacao { get; set; } // Data de criação do registro
        public DateTime? DataAtualizacao { get; set; } // Data da última atualização do registro (opcional)
        public StatusEnum Status { get; set; } = StatusEnum.Ativo; // Status do usuário (Ativo ou Inativo)
        public int Seguidores { get; set; }
        public string? Pronome { get; set; }
        public ICollection<RedeSocial> RedesSociais { get; set; } = new List<RedeSocial>();
    }
}
