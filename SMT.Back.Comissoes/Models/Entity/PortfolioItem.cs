using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class PortfolioItem
    {
        [Key]
        public int Id { get; set; }

        public int ArtistaId { get; set; }
        [ForeignKey(nameof(ArtistaId))]
        public Artista Artista { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public string UrlArquivo { get; set; } = string.Empty;
        public int Ordem { get; set; }
        public int LikeCount { get; set; }
        public int FavoritoCount { get; set; }
        public int VisualizacaoCount { get; set; }
        public DateTime DataCriacao { get; set; }

    }
}
