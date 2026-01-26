using System.ComponentModel;

namespace SMT.Back.Comissoes.Models.Enum
{
    public enum TipoUsuarioEnum
    {
        [Description("Todos")]
        Todos = 0,
        [Description("Pessoa Física")]
        PessoaFisica = 1,
        [Description("Pessoa Jurídica")]
        PessoaJuridica = 2
    }
}