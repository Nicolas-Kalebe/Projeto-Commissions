using System.ComponentModel;

namespace SMT.Back.Comissoes.Models.Enum
{
    public enum TipoInteracaoEnum
    {
        [Description("Like")]
        Curtida = 1,
        [Description("Salvar")]
        Salvamento = 2,
        [Description("Seguir")]
        Seguimento = 3,
        [Description("Avaliação")]
        Avaliacao = 4
    }
}
