using Microsoft.AspNetCore.Mvc;
using SMT.Back.Comissoes.DTO.Input.Usuario;
using SMT.Back.Comissoes.DTO.Input.UsuarioController;
using SMT.Back.Comissoes.Models;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.Net;

namespace SMT.Back.Comissoes.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        public async Task<IActionResult> ObterStatusUsuario()
        {
            var statusUsuario = await _usuarioService.ObterStatusUsuario();
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Status do usuario obtido com sucesso.",
                Resultado = statusUsuario
            });
        }

        [HttpGet]
        public async Task<IActionResult> ObterMeuUsuario()
        {
            var usuario = await _usuarioService.ObterMeuUsuario();
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Usuario autenticado obtido com sucesso.",
                Resultado = usuario
            });
        }

        [HttpPatch]
        public async Task<IActionResult> AtualizarPerfilUsuario([FromBody] AtualizarPerfilUsuarioInput input)
        {
            var usuario = await _usuarioService.AtualizarPerfilUsuario(input);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Dados do usuario atualizados com sucesso.",
                Resultado = usuario
            });
        }

        [HttpPatch]
        public async Task<IActionResult> AtualizarFotoUsuario([FromForm] AtualizarFotoUsuarioInput input)
        {
            var fotoUsuario = await _usuarioService.AtualizarFotoUsuario(input);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Foto de usuario atualizada com sucesso.",
                Resultado = fotoUsuario
            });
        }

        [HttpPatch]
        public async Task<IActionResult> AtualizarRedesSociais([FromBody] AtualizarRedesSociaisInput input)
        {
            await _usuarioService.AtualizarRedesSociais(input);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Redes sociais atualizadas com sucesso.",
                Resultado = "Sucesso ao atualizar redes sociais."
            });
        }

        [HttpPost]
        public async Task<IActionResult> CadastrarArtista([FromBody] CadastrarArtistaInput input)
        {
            await _usuarioService.CadastrarArtista(input);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Usuario cadastrado como artista com sucesso.",
                Resultado = "Sucesso ao cadastrar usuario como artista."
            });
        }

        [HttpGet]
        public async Task<IActionResult> ObterPerfilArtista()
        {
            var artista = await _usuarioService.ObterPerfilArtista();
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Perfil de artista obtido com sucesso.",
                Resultado = artista
            });
        }

        [HttpPatch]
        public async Task<IActionResult> AtualizarPerfilArtista([FromBody] AtualizarPerfilArtistaInput input)
        {
            var artista = await _usuarioService.AtualizarPerfilArtista(input);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Perfil de artista atualizado com sucesso.",
                Resultado = artista
            });
        }

        [HttpPost]
        public async Task<IActionResult> CadastrarPortfolio([FromForm] CadastrarPortfolioInput input)
        {
            await _usuarioService.CadastrarPortfolioAsync(input);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Portfolio atualizado com sucesso.",
                Resultado = "Sucesso ao atualizar portfolio do artista."
            });
        }
    }
}
