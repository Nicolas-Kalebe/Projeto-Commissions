using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class TermoDeServico
    {
        [Key]
        public int Id { get; set; }
        public int ArtistaId { get; set; }
        [ForeignKey(nameof(ArtistaId))]
        public Artista Artista { get; set; }
        public string Titulo { get; set; }
        public string Conteudo { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime DataAtualizacao { get; set; }
    }
}
