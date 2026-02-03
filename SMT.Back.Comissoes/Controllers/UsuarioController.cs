using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SMT.Back.Comissoes.DTO.Input.Usuario;
using SMT.Back.Comissoes.DTO.Input.UsuarioController;
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
                Resultado = "Cadastro de usuário realizado com sucesso."
            });
        }
        //[HttpPost]
        //public async Task<IActionResult> Autenticar([FromBody] AutenticarUsuarioInput autenticarUsuarioInput)
        //{
        //    var usuarioAutenticado = await _usuarioService.AutenticarUsuario(autenticarUsuarioInput);
        //    return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
        //    {
        //        Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
        //        StatusHttp = (int)HttpStatusCode.OK,
        //        Mensagem = "Usuário autenticado com sucesso.",
        //        Resultado = usuarioAutenticado
        //    });
        //}

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
        [HttpPost]
        public async Task<IActionResult> CadastrarArtista([FromBody] CadastrarArtistaInput cadastrarArtistaInput)
        {
            await _usuarioService.CadastrarArtista(cadastrarArtistaInput);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Usuário cadastrado como artista com sucesso",
                Resultado = "Sucesso ao cadastrar usuário como artista no sistema."
            });
        }
        [HttpPost]
        public async Task<IActionResult> ObterPerfilArtista([FromBody] ObterArtistaInput obterArtistaInput)
        {
            var artista = await _usuarioService.ObterPerfilArtista(obterArtistaInput);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Perfil de artista obtido com sucesso.",
                Resultado = artista
            });
        }
        [HttpPost]
        public async Task<IActionResult> ObterUsuarioPorToken([FromBody] ObterTokenGoogleInput obterTokenGoogleInput)
        {
            var usuario = await _usuarioService.ObterUsuarioPorToken(obterTokenGoogleInput);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Usuário obtido com sucesso pelo token Google.",
                Resultado = usuario
            });
        }
        [HttpPost]
        public async Task<IActionResult> CadastrarPortfolio([FromForm] CadastrarPortfolioInput cadastrarPortfolioInput)
        {
            await _usuarioService.CadastrarPortfolioAsync(cadastrarPortfolioInput);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Portfólio atualizado com sucesso.",
                Resultado = "Sucesso ao atualizar portfólio do artista."
            });
        }
        [HttpPatch]
        public async Task<IActionResult> AtualizarFotoUsuario([FromForm] AtualizarFotoUsuarioInput atualizarFotoUsuarioInput)
        {
            var fotoUsuario = await _usuarioService.AtualizarFotoUsuario(atualizarFotoUsuarioInput);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Foto de usuário atualizada com sucesso.",
                Resultado = $"Sucesso ao atualizar foto de usuário, segue imagem: {fotoUsuario}"

            });
        }
        [HttpPatch]
        public async Task<IActionResult> AtualizarRedesSociais([FromBody] AtualizarRedesSociaisInput atualizarDadosUsuarioInput)
        {
            await _usuarioService.AtualizarRedesSociais(atualizarDadosUsuarioInput);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Dados do usuário atualizados com sucesso.",
                Resultado = "Sucesso ao atualizar dados do usuário."
            });
        }
    }
}
