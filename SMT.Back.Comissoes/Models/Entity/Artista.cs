using SMT.Back.Comissoes.Models.Enum;
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
        public string? Estilo { get; set; }
        [Required]
        public CargoArtistaEnum CargoArtista { get; set; }
        public PrazoEntregaEnum? PrazoMedioEntrega { get; set; }
        public List<string>? TagsArtista { get; set; }
        public ICollection<PortfolioItem> PortfolioItens { get; set; } = new List<PortfolioItem>();
        public double Avaliacao { get; set; }
        public bool AtivoParaServicos { get; set; }
        public ICollection<Servicos>? Servicos { get; set; }
    }
}
