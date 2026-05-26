using System.ComponentModel.DataAnnotations;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class CodigoVerificacaoEmail
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string CodigoHash { get; set; } = string.Empty;
        [Required]
        public DateTime ExpiraEm { get; set; }
        public int Tentativas { get; set; } = 0;
        public bool Consumido { get; set; } = false;
        [Required]
        public DateTime DataCriacao { get; set; }
    }
}
