using Microsoft.AspNetCore.Mvc;
using SMT.Back.Comissoes.Models;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using Serilog;
using System.Net;
using SMT.Back.Comissoes.DTO.Input.UsuarioController;

namespace SMT.Back.Comissoes.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AuthController : ControllerBase
    {
        public readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        public async Task<IActionResult> ValidarTokenGoogle([FromBody] ValidarUsuarioGoogleInput validarUsuarioGoogleInput)
        {
            if (validarUsuarioGoogleInput == null || string.IsNullOrEmpty(validarUsuarioGoogleInput.TokenGoogle))
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DadoNulo,
                    $"Token do Google nulo ou vazio, campo obrigatório. Token:{validarUsuarioGoogleInput?.TokenGoogle}",
                    () => Log.Warning("Token do Google nulo ou vazio, campo obrigatório. Token:{TokenGoogle}", validarUsuarioGoogleInput?.TokenGoogle),
                    (int)System.Net.HttpStatusCode.BadRequest);
            }
            var resultado = await _authService.ValidarTokenGoogle(validarUsuarioGoogleInput.TokenGoogle);
            Log.Information("Token Google validado com sucesso para o usuário: {Email}", resultado.Email);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                StatusHttp = (int)HttpStatusCode.OK,
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                Mensagem = "Token Google validado com sucesso.",
                Resultado = resultado
            });
        }
    }
}
