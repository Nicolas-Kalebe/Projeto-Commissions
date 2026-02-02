using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.DTO.Input.Interacao
{
    public class InteracaoFavoritoInput
    {
        public string GoogleToken { get; set; } = string.Empty;
        public int AlvoId { get; set; }
        public TipoAlvoInteracaoEnum TipoAlvoInteracao { get; set; }
    }
}
