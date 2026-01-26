using Google.Apis.Auth;

namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface IAuthService
    {
        Task<GoogleJsonWebSignature.Payload> ValidarTokenGoogle(string token);
    }
}
