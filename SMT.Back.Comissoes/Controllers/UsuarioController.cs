using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SMT.Back.Comissoes.DTO.Input;
using SMT.Back.Comissoes.Models;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.Net;

namespace SMT.Back.Comissoes.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UsuarioController : ControllerBase
    {
        public readonly IUsuarioService _usuarioService;
        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost]
        public async Task<IActionResult> Cadastrar([FromBody] CadastrarUsuarioInput usuarioInput)
        {
            await _usuarioService.CadastrarUsuario(usuarioInput);
            Log.Information($"Usuário cadastrado com sucesso: Nome de Perfil: {usuarioInput.NomePerfil}");
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Usuário cadastrado com sucesso.",
            });
        }
        [HttpPost]
        public async Task<IActionResult> ObterStatusUsuario([FromBody] ObterStatusInput obterStatusInput)
        {
            var statusUsuario = await _usuarioService.ObterStatusUsuario(obterStatusInput);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Status do usuário obtido com sucesso.",
                Resultado = statusUsuario
            });
        }
    }
}
