using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using Serilog;

namespace SMT.Back.Comissoes.Services
{
    public class CurrentUser : ICurrentUser
    {
        private readonly IHttpContextAccessor _accessor;

        public CurrentUser(IHttpContextAccessor accessor)
        {
            _accessor = accessor;
        }

        public int UsuarioId
        {
            get
            {
                var claim = _accessor.HttpContext?.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                    ?? _accessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(claim, out var id))
                    throw new ExcecaoPersonalizada(
                        ConstantesCodigoRetornoPadrao.TokenInvalido,
                        "Usuário não autenticado.",
                        () => Log.Warning("Tentativa de acesso sem claim sub válido."),
                        (int)HttpStatusCode.Unauthorized);
                return id;
            }
        }

        public string Email =>
            _accessor.HttpContext?.User.FindFirst(JwtRegisteredClaimNames.Email)?.Value
            ?? _accessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value
            ?? string.Empty;

        public string NomePerfil =>
            _accessor.HttpContext?.User.FindFirst("nomePerfil")?.Value ?? string.Empty;
    }
}
