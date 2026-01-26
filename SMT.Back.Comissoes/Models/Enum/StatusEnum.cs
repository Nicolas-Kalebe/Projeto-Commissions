using System.ComponentModel;

namespace SMT.Back.Comissoes.Models.Enum
{
    public enum StatusEnum
    {
        [Description("Ativo")]
        Ativo = 1,
        [Description("Inativo")]
        Inativo = 2,
        [Description("Deletado")]
        Deletado = 3
    }
}