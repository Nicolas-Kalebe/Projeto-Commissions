using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SMT.Back.Comissoes.DTO.Output.Usuario
{
    public class ObterPerfilArtistaOutput
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        [ForeignKey(nameof(UsuarioId))]
        public string? Estilo { get; set; }
        public string CargoArtista { get; set; } = string.Empty;
        public string? PrazoMedioEntrega { get; set; }
        public ICollection<PortfolioItem> PortfolioItens { get; set; } = new List<PortfolioItem>();
        public double Avaliacao { get; set; }
        public bool AtivoParaServicos { get; set; }
        public ICollection<Servicos>? Servicos { get; set; }
    }
}

