using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface IInteracaoService
    {
        Task CurtirAsync(int usuarioId, int alvoId, TipoAlvoInteracaoEnum tipoAlvo);
        Task DescurtirAsync(int usuarioId, int alvoId, TipoAlvoInteracaoEnum tipoAlvo);
        Task SalvarAsync(int usuarioId, int alvoId, TipoAlvoInteracaoEnum tipoAlvo);
        Task RemoverSalvarAsync(int usuarioId, int alvoId, TipoAlvoInteracaoEnum tipoAlvo);
        Task SeguirAsync(int usuarioId, int perfilId);
        Task DeixarDeSeguirAsync(int usuarioId, int perfilId);
        Task AvaliarAsync(int usuarioId, int perfilId, int valor);
    }

}
