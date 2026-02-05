using SMT.Back.Comissoes.Models.Entity;

namespace SMT.Back.Comissoes.DTO.Output.Usuario
{
    public class PortfolioItemOutput
    {
        public int Id { get; set; }
        public int ArtistaId { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public List<string>? Hashtags { get; set; } = new List<string>();
        public ICollection<PortfolioItemImagem> Imagens { get; set; } = new List<PortfolioItemImagem>();
        public int QuantidadeCurtidas { get; set; }
        public int QuantidadeSalvos { get; set; }
        public int QuantidadeVisualizacoes { get; set; }
        public DateTime DataCriacao { get; set; }
        public bool CurtidoPeloUsuario { get; set; }
        public bool SalvoPeloUsuario { get; set; }
    }
}
