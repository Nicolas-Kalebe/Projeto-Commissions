using Google.Apis.Auth;
using Serilog;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.Net;
namespace SMT.Back.Comissoes.Services
{
    public class AuthService : IAuthService
    {
        private readonly string _googleClientId;
        public AuthService(IConfiguration configuration)
        {
            _googleClientId = configuration["GoogleAuth:ClientId"];
        }
        public async Task<GoogleJsonWebSignature.Payload> ValidarTokenGoogle(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                Log.Error("Token Google inválido ou nulo.");
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DadoNulo,
                    "Token Google inválido ou nulo.",
                    () => Log.Error($"Token google inválido ou nulo. Token:{token}."),
                    (int)HttpStatusCode.NotFound
                    );
            }
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] 
                {
                    _googleClientId
                }
            };
            return await GoogleJsonWebSignature.ValidateAsync(token, settings);
        }
    }
}
