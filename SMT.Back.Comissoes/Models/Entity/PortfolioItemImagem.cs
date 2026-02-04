using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class PortfolioItemImagem
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(PortfolioItemId))]
        public int PortfolioItemId { get; set; }
        [Required]
        public string UrlArquivo { get; set; } = string.Empty;
        public int Ordem { get; set; } // ordem das imagens (1ª, 2ª, etc)
        public bool Principal { get; set; } // imagem de capa
    }
}
