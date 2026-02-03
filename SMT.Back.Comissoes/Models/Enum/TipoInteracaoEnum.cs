using System.ComponentModel;

namespace SMT.Back.Comissoes.Models.Enum
{
    public enum TipoInteracaoEnum
    {
        [Description("Like")]
        Like = 1,
        [Description("Salvar")]
        Favorito = 2,
        [Description("Seguir")]
        Seguir = 3,
        [Description("Avaliação")]
        Avaliacao = 4
    }
}
