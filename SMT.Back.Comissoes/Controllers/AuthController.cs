using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SMT.Back.Comissoes.DTO.Input.Auth;
using SMT.Back.Comissoes.Models;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.Net;

namespace SMT.Back.Comissoes.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Cadastrar([FromBody] CadastrarLocalInput input)
        {
            await _authService.Cadastrar(input);
            Log.Information($"Cadastro local iniciado para {input.Email}.");
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                StatusHttp = (int)HttpStatusCode.OK,
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                Mensagem = "Cadastro iniciado. Verifique seu e-mail para confirmar o código.",
                Resultado = null
            });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmarEmail([FromBody] ConfirmarEmailInput input)
        {
            var resultado = await _authService.ConfirmarEmail(input);
            Log.Information($"Email confirmado para {input.Email}.");
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                StatusHttp = (int)HttpStatusCode.OK,
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                Mensagem = "E-mail confirmado com sucesso.",
                Resultado = resultado
            });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ReenviarCodigo([FromBody] ReenviarCodigoInput input)
        {
            await _authService.ReenviarCodigo(input);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                StatusHttp = (int)HttpStatusCode.OK,
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                Mensagem = "Se o e-mail estiver cadastrado e pendente, um novo código foi enviado.",
                Resultado = null
            });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> LoginLocal([FromBody] LoginLocalInput input)
        {
            var resultado = await _authService.LoginLocal(input);
            Log.Information($"LoginLocal sucesso: {input.Email}.");
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                StatusHttp = (int)HttpStatusCode.OK,
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                Mensagem = "Autenticado com sucesso.",
                Resultado = resultado
            });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ValidarTokenGoogle([FromBody] ValidarTokenGoogleAuthInput input)
        {
            if (input == null || string.IsNullOrEmpty(input.TokenGoogle))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DadoNulo,
                    "Token do Google nulo ou vazio, campo obrigatório.",
                    () => Log.Warning("Token Google nulo"),
                    (int)HttpStatusCode.BadRequest);

            var resultado = await _authService.LoginGoogle(input.TokenGoogle);
            Log.Information($"LoginGoogle sucesso: {resultado.Usuario.Email}.");
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                StatusHttp = (int)HttpStatusCode.OK,
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                Mensagem = "Autenticado com sucesso.",
                Resultado = resultado
            });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenInput input)
        {
            var resultado = await _authService.RefreshToken(input);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                StatusHttp = (int)HttpStatusCode.OK,
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                Mensagem = "Token renovado.",
                Resultado = resultado
            });
        }

        [HttpPost]
        public async Task<IActionResult> Logout([FromBody] LogoutInput input)
        {
            await _authService.Logout(input.RefreshToken);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                StatusHttp = (int)HttpStatusCode.OK,
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                Mensagem = "Logout realizado.",
                Resultado = null
            });
        }
    }
}
