using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.DTO.Input.Usuario
{
    public class AtualizarPerfilArtistaInput
    {
        public int UsuarioId { get; set; }
        public string? EstiloDescricao { get; set; }
        public PrazoEntregaEnum? PrazoMedioEntrega { get; set; }
        public CargoArtistaEnum? CargoArtista { get; set; }

    }
}
