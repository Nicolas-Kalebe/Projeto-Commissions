using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class Servicos
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(ArtistaId))]
        public int ArtistaId { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public List<ServicosImagem> ServicosImages { get; set; } = new List<ServicosImagem>();
        public TermoDeServico TermosDeServico { get; set; }
        public decimal Preco { get; set; }
        //public List<Cards> Card { get; set; } = new List<Cards>();
        //public List<Avaliacoes> Avaliacoes { get; set; } //média de avaliações, com nota por usuário e descrição
        public bool Ativo { get; set; }
    }
}
