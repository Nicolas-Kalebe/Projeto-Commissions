using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.DTO.Input.Interacao
{
    public class InteracaoCurtidaInput
    {
        public int AlvoId { get; set; }
        public TipoAlvoInteracaoEnum TipoAlvoInteracao { get; set; }
    }
}
