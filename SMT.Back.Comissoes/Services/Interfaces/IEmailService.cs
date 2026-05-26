namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface IEmailService
    {
        Task EnviarCodigoVerificacao(string emailDestino, string nome, string codigo);
    }
}
