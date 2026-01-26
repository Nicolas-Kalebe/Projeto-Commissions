using System.Net;

namespace SMT.Back.Comissoes.Utils
{
    public class ExcecaoPersonalizada : Exception
    {
        public string CodigoDeErro { get; private set; }
        public int StatusHttp { get; private set; }
        public string Mensagem { get; private set; }
        public Action LogAction { get; private set; }

        public ExcecaoPersonalizada(
            string codigoDeErro,
            string mensagemParaUsuario,
            Action logAction,
            int statusHttp,
            Exception? innerException = null)
            : base(mensagemParaUsuario, innerException)
        {
            CodigoDeErro = codigoDeErro;
            StatusHttp = statusHttp;
            Mensagem = mensagemParaUsuario;
            LogAction = logAction ?? (() => { });
            LogAction();
        }

        public ExcecaoPersonalizada(
            string codigoDeErro,
            string mensagemParaUsuario,
            Action logAction)
            : this(codigoDeErro, mensagemParaUsuario, logAction, (int)HttpStatusCode.BadRequest)
        {
        }
    }
}
