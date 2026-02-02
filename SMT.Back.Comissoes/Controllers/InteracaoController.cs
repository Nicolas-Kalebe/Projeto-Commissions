using Microsoft.AspNetCore.Mvc;
using SMT.Back.Comissoes.DTO.Input;
using SMT.Back.Comissoes.DTO.Input.Interacao;
using SMT.Back.Comissoes.Models;
using SMT.Back.Comissoes.Models.Enum;
using SMT.Back.Comissoes.Services;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.Net;

namespace SMT.Back.Comissoes.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class InteracaoController : ControllerBase
    {
        private readonly IInteracaoService _interacaoService;
        private readonly IUsuarioService _usuarioService;
        private readonly IAuthService _authService;

        public InteracaoController(IInteracaoService interacaoService, IUsuarioService usuarioService, AuthService authService)
        {
            _interacaoService = interacaoService;
            _usuarioService = usuarioService;
            _authService = authService;
        }

        [HttpPost]
        public async Task<IActionResult> CurtirPortfolio([FromBody] InteracaoPortfolioInput input)
        {
            await _authService.ValidarTokenGoogle(input?.GoogleToken);
            var usuarioId = await ObterUsuarioId(input.GoogleToken);

            await _interacaoService.LikeAsync(usuarioId, input.PortfolioItemId);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Like registrado com sucesso.",
                Resultado = "Like registrado com sucesso."
            });
        }

        [HttpPost]
        public async Task<IActionResult> Favoritar([FromBody] InteracaoFavoritoInput input)
        {
            await _authService.ValidarTokenGoogle(input.GoogleToken);
            if (input.TipoAlvoInteracao == TipoAlvoInteracaoEnum.PerfilArtista)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Favorito so pode ser aplicado em portfolio ou post.",
                    () => { },
                    (int)HttpStatusCode.BadRequest);
            }

            var usuarioId = await ObterUsuarioId(input.GoogleToken);
            await _interacaoService.FavoritarAsync(usuarioId, input.AlvoId, input.TipoAlvoInteracao);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Favorito registrado com sucesso.",
                Resultado = "Favorito registrado com sucesso."
            });
        }

        [HttpPost]
        public async Task<IActionResult> Desfavoritar([FromBody] InteracaoFavoritoInput input)
        {
            await _authService.ValidarTokenGoogle(input.GoogleToken);
            if (input.TipoAlvoInteracao == TipoAlvoInteracaoEnum.PerfilArtista)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Favorito so pode ser aplicado em portfolio ou post.",
                    () => { },
                    (int)HttpStatusCode.BadRequest);
            }

            var usuarioId = await ObterUsuarioId(input.GoogleToken);
            await _interacaoService.DesfavoritarAsync(usuarioId, input.AlvoId, input.TipoAlvoInteracao);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Favorito removido com sucesso.",
                Resultado = "Favorito removido com sucesso."
            });
        }

        [HttpPost]
        public async Task<IActionResult> Seguir([FromBody] InteracaoSeguirInput input)
        {
            await _authService.ValidarTokenGoogle(input.GoogleToken);
            var usuarioId = await ObterUsuarioId(input.GoogleToken);

            await _interacaoService.SeguirAsync(usuarioId, input.PerfilId);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Seguimento registrado com sucesso.",
                Resultado = "Seguimento registrado com sucesso."
            });
        }

        [HttpPost]
        public async Task<IActionResult> DeixarDeSeguir([FromBody] InteracaoSeguirInput input)
        {
            await _authService.ValidarTokenGoogle(input.GoogleToken);
            var usuarioId = await ObterUsuarioId(input.GoogleToken);

            await _interacaoService.DeixarDeSeguirAsync(usuarioId, input.PerfilId);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Seguimento removido com sucesso.",
                Resultado = "Seguimento removido com sucesso."
            });
        }

        [HttpPost]
        public async Task<IActionResult> Avaliar([FromBody] InteracaoAvaliacaoInput input)
        {
            await _authService.ValidarTokenGoogle(input.GoogleToken);
            var usuarioId = await ObterUsuarioId(input.GoogleToken);

            await _interacaoService.AvaliarAsync(usuarioId, input.PerfilId, input.Valor);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Avaliacao registrada com sucesso.",
                Resultado = "Avaliacao registrada com sucesso."
            });
        }

        private async Task<int> ObterUsuarioId(string googleToken)
        {
            var usuario = await _usuarioService.ObterUsuarioPorToken(new DTO.Input.UsuarioController.ObterTokenGoogleInput
            {
                GoogleToken = googleToken
            });
            return usuario.Id;
        }
    }
}
