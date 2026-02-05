using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.DTO.Input.Usuario
{
    public class AtualizarPerfilArtistaInput
    {
        public string? EstiloDescricao { get; set; }
        public PrazoEntregaEnum? PrazoMedioEntrega { get; set; }
        public CargoArtistaEnum? Cargo { get; set; }

    }
}
