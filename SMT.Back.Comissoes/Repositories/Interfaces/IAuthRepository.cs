using SMT.Back.Comissoes.Models.Entity;

namespace SMT.Back.Comissoes.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<CodigoVerificacaoEmail?> ObterCodigoAtivoPorEmail(string email);
        Task<CodigoVerificacaoEmail?> ObterUltimoCodigoPorEmail(string email);
        Task InvalidarCodigosAtivos(string email);
        Task CriarCodigo(CodigoVerificacaoEmail codigo);
        Task AtualizarCodigo(CodigoVerificacaoEmail codigo);

        Task CriarRefreshToken(RefreshToken refreshToken);
        Task<RefreshToken?> ObterRefreshTokenPorHash(string tokenHash);
        Task AtualizarRefreshToken(RefreshToken refreshToken);
    }
}
