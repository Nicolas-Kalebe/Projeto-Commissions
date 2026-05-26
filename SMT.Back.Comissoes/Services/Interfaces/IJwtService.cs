using System.Security.Claims;
using SMT.Back.Comissoes.Models.Entity;

namespace SMT.Back.Comissoes.Services.Interfaces
{
    public class TokenPar
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
    }

    public interface IJwtService
    {
        TokenPar GerarTokens(Usuario usuario);
        string GerarRefreshTokenOpaco();
        string HashRefreshToken(string refreshToken);
        ClaimsPrincipal? ValidarTokenSemExpiracao(string token);
        int RefreshTokenDays { get; }
    }
}
