using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SMT.Back.Comissoes.DTO.Input;
using SMT.Back.Comissoes.Models;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.Net;

namespace SMT.Back.Comissoes.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        public readonly IUsuarioService _usuarioService;
        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost]
        public async Task<IActionResult> CadastrarUsuario([FromBody] CadastrarUsuarioInput usuarioInput)
        {
            await _usuarioService.CadastrarUsuario(usuarioInput);
            Log.Information($"Usuário cadastrado com sucesso: Nome de Perfil: {usuarioInput.NomePerfil}, Email {usuarioInput.Email}");
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Usuário cadastrado com sucesso.",
            }
            );
        }
    }
}
