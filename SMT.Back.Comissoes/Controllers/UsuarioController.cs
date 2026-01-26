using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SMT.Back.Comissoes.DTO.Input;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Services.Interfaces;

namespace SMT.Back.Comissoes.Controllers
{
    [Authorize]
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
            return Ok();
        }
    }
}
