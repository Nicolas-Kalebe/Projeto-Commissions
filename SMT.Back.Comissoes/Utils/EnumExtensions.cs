using System.ComponentModel;
using System.Reflection;

namespace SMT.Back.Comissoes.Utils
{
    public static class EnumExtensions
    {
        public static string? obterDescricaoEnum(this Enum valor)
        {
            var enumValor = valor.GetType().GetField(valor.ToString());
            var atributo = enumValor?.GetCustomAttribute<DescriptionAttribute>();
            return atributo?.Description ?? valor.ToString();
        }
    }
}
