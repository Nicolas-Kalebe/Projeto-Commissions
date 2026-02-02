using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class Interacao
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        public TipoInteracaoEnum TipoInteracao { get; set; } // Like, Favorito        
        public TipoAlvoInteracaoEnum TipoAlvoInteracao { get; set; } // PortfolioItem, Post, PerfilArtista
        public int AlvoId { get; set; }
        public int? Valor { get; set; } // Por exemplo, para avaliações (1 a 5 estrelas)
        public DateTime DataCriacao { get; set; }
    }
}
