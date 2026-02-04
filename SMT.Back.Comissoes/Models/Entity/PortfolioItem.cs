using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class PortfolioItem
    {
        [Key]
        public int Id { get; set; }

        public int ArtistaId { get; set; }
        [ForeignKey(nameof(ArtistaId))]
        [JsonIgnore]
        public Artista Artista { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public List<string>? Hashtags { get; set; } = new List<string>();
        public ICollection<PortfolioItemImagem> Imagens { get; set; } = new List<PortfolioItemImagem>();
        public int Ordem { get; set; }
        public int LikeCount { get; set; }
        public int FavoritoCount { get; set; }
        public int VisualizacaoCount { get; set; }
        public DateTime DataCriacao { get; set; }

    }
}
