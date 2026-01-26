using Google.Apis.Auth;
using SMT.Back.Comissoes.Services.Interfaces;

namespace SMT.Back.Comissoes.Services
{
    public class AuthService : IAuthService
    {
        public async Task<GoogleJsonWebSignature.Payload> ValidarTokenGoogle(string token)
        {
            return await GoogleJsonWebSignature.ValidateAsync(token);
        }
    }
}
