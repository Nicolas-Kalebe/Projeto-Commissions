using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SMT.Back.Comissoes.Models.Entity
{
    public class RedeSocial
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Titulo { get; set; } = string.Empty;// se preferir "Nome", mantenha
        [Required]
        public string Url { get; set; } = string.Empty;
        [Required]
        [JsonIgnore]
        public int UsuarioId { get; set; }
    }
}
