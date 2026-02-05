using System.ComponentModel;

namespace SMT.Back.Comissoes.Models.Enum
{
    public enum PronomeEnum
    {
        [Description("Ela/dela")]
        Ela = 1,
        [Description("Ele/dele")]
        Ele = 2,
        [Description("Elu/delu")]
        Elu = 3,
        [Description("Não informado")]
        NaoInformado = 4
    }
}
