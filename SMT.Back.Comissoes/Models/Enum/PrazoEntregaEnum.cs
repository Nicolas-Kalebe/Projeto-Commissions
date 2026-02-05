using System.ComponentModel;

namespace SMT.Back.Comissoes.Models.Enum
{
    public enum PrazoEntregaEnum
    {
        [Description("Um a três dias")]
        TresDias = 1,
        [Description("Uma semana")]
        SeteDias = 2,
        [Description("Meio mês")]
        MeioMes = 3,
        [Description("Trinta dias")]
        UmMes = 4,
    }
}
