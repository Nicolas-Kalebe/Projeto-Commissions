using SMT.Back.Comissoes.Models.Enum;

namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface IInteracaoService
    {
        Task LikeAsync(int usuarioId, int portfolioItemId);
        Task FavoritarAsync(int usuarioId, int alvoId, TipoAlvoInteracaoEnum tipoAlvo);
        Task DesfavoritarAsync(int usuarioId, int alvoId, TipoAlvoInteracaoEnum tipoAlvo);
        Task SeguirAsync(int usuarioId, int perfilId);
        Task DeixarDeSeguirAsync(int usuarioId, int perfilId);
        Task AvaliarAsync(int usuarioId, int perfilId, int valor);
    }

}
