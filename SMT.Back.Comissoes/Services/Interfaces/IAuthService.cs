using Google.Apis.Auth;
using SMT.Back.Comissoes.DTO.Input.Auth;
using SMT.Back.Comissoes.DTO.Output.Auth;

namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface IAuthService
    {
        Task<GoogleJsonWebSignature.Payload> ValidarTokenGoogle(string token);
        Task Cadastrar(CadastrarLocalInput input);
        Task<AuthOutput> ConfirmarEmail(ConfirmarEmailInput input);
        Task ReenviarCodigo(ReenviarCodigoInput input);
        Task<AuthOutput> LoginLocal(LoginLocalInput input);
        Task<AuthOutput> LoginGoogle(string tokenGoogle);
        Task<AuthOutput> RefreshToken(RefreshTokenInput input);
        Task Logout(string refreshToken);
    }
}
