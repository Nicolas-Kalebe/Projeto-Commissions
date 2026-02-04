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
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public List<ServicosImagem> ServicosImages { get; set; }
        public TermoDeServico DescricaoTermos { get; set; }
        public decimal Preco { get; set; }
        public List<string> Card { get; set; }
        //public List<Avaliacoes> Avaliacoes { get; set; } //média de avaliações, com nota por usuário e descrição
        public bool Ativo { get; set; }
    }
}
