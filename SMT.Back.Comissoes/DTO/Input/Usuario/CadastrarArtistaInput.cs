using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.DTO.Input.UsuarioController
{
    public class CadastrarArtistaInput
    {
        public int UsuarioId { get; set; }
        public CargoArtistaEnum CargoArtista { get; set; }
        public PrazoEntregaEnum? PrazoMedioEntrega { get; set; }
    }
}
