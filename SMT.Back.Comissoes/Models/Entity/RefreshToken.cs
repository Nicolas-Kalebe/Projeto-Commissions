using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int UsuarioId { get; set; }
        [ForeignKey(nameof(UsuarioId))]
        public Usuario? Usuario { get; set; }
        [Required]
        public string TokenHash { get; set; } = string.Empty;
        [Required]
        public DateTime ExpiraEm { get; set; }
        public bool Revogado { get; set; } = false;
        public int? SubstituidoPor { get; set; }
        [Required]
        public DateTime DataCriacao { get; set; }
        public string? IpCriacao { get; set; }
    }
}
