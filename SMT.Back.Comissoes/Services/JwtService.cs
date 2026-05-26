using Microsoft.IdentityModel.Tokens;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SMT.Back.Comissoes.Services
{
    public class JwtService : IJwtService
    {
        private readonly string _issuer;
        private readonly string _audience;
        private readonly string _signingKey;
        private readonly int _accessTokenMinutes;
        private readonly int _refreshTokenDays;

        public JwtService(IConfiguration configuration)
        {
            _issuer = configuration["Jwt:Issuer"]
                ?? throw new InvalidOperationException("Jwt:Issuer nao configurado.");
            _audience = configuration["Jwt:Audience"]
                ?? throw new InvalidOperationException("Jwt:Audience nao configurado.");
            _signingKey = configuration["Jwt:SigningKey"]
                ?? throw new InvalidOperationException("Jwt:SigningKey nao configurado.");
            _accessTokenMinutes = int.Parse(configuration["Jwt:AccessTokenMinutes"] ?? "60");
            _refreshTokenDays = int.Parse(configuration["Jwt:RefreshTokenDays"] ?? "5");
        }

        public TokenPar GerarTokens(Usuario usuario)
        {
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                new(JwtRegisteredClaimNames.Email, usuario.Email),
                new("nomePerfil", usuario.NomePerfil),
                new("provedor", usuario.ProvedorAutenticacao.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_signingKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expira = DateTime.UtcNow.AddMinutes(_accessTokenMinutes);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: expira,
                signingCredentials: creds);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            var refreshToken = GerarRefreshTokenOpaco();

            return new TokenPar
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresIn = _accessTokenMinutes * 60
            };
        }

        public string GerarRefreshTokenOpaco()
        {
            var bytes = new byte[48];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .Replace("=", "");
        }

        public string HashRefreshToken(string refreshToken)
        {
            using var sha = SHA256.Create();
            var hashBytes = sha.ComputeHash(Encoding.UTF8.GetBytes(refreshToken));
            return Convert.ToBase64String(hashBytes);
        }

        public int RefreshTokenDays => _refreshTokenDays;

        public ClaimsPrincipal? ValidarTokenSemExpiracao(string token)
        {
            try
            {
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_signingKey));
                var parameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = false,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _issuer,
                    ValidAudience = _audience,
                    IssuerSigningKey = key,
                    ClockSkew = TimeSpan.Zero
                };

                var handler = new JwtSecurityTokenHandler();
                var principal = handler.ValidateToken(token, parameters, out var validated);

                if (validated is not JwtSecurityToken jwt ||
                    !jwt.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.OrdinalIgnoreCase))
                    return null;

                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
