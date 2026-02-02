using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class LinkSocial
    {
        public int Id { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required]
        public string Url { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }
}
