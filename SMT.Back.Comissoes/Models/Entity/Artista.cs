using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class Artista
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int UsuarioId { get; set; }
        [ForeignKey(nameof(UsuarioId))]
        public Usuario Usuario { get; set; }
        public string? Estilo { get; set; }
        public string? TipoArtista { get; set; }
        public string? PortifolioUrl { get; set; } //o codex colocou pra funcionar
        public ICollection<PortfolioItem> Portfolio { get; set; }
        public double Avaliacao { get; set; }
        public bool AtivoParaServicos { get; set; }
        public ICollection<Servicos>? Servicos { get; set; }
    }
}
