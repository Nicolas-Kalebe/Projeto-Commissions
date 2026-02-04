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

        public InteracaoController(IInteracaoService interacaoService, IUsuarioService usuarioService, IAuthService authService)
        {
            _interacaoService = interacaoService;
            _usuarioService = usuarioService;
            _authService = authService;
        }

        [HttpPost]
        public async Task<IActionResult> Curtir([FromBody] InteracaoCurtidaInput interacaoCurtidaInput)
        {
            if (interacaoCurtidaInput.TipoAlvoInteracao != TipoAlvoInteracaoEnum.PortfolioItem &&
                interacaoCurtidaInput.TipoAlvoInteracao != TipoAlvoInteracaoEnum.Post)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Descurtir só pode ser aplicado em portfolio ou post.",
                    () => { },
                    (int)HttpStatusCode.BadRequest);
            }
            var usuarioId = await ObterUsuarioId(interacaoCurtidaInput.GoogleToken);
            await _interacaoService.CurtirAsync(usuarioId, interacaoCurtidaInput.AlvoId, interacaoCurtidaInput.TipoAlvoInteracao);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Like registrado com sucesso.",
                Resultado = "Like registrado com sucesso."
            });
        }

        [HttpDelete]
        public async Task<IActionResult> Descurtir([FromBody] InteracaoCurtidaInput interacaoCurtidaInput)
        {
            if (interacaoCurtidaInput.TipoAlvoInteracao != TipoAlvoInteracaoEnum.PortfolioItem &&
                interacaoCurtidaInput.TipoAlvoInteracao != TipoAlvoInteracaoEnum.Post)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Descurtir só pode ser aplicado em portfolio ou post.",
                    () => { },
                    (int)HttpStatusCode.BadRequest);
            }
            var usuarioId = await ObterUsuarioId(interacaoCurtidaInput.GoogleToken);

            await _interacaoService.DescurtirAsync(usuarioId, interacaoCurtidaInput.AlvoId, interacaoCurtidaInput.TipoAlvoInteracao);
            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Like removido com sucesso.",
                Resultado = "Like removido com sucesso."
            });
        }

        [HttpPost]
        public async Task<IActionResult> Salvar([FromBody] InteracaoSalvamentoInput interacaoFavoritoInput)
        {
            if (interacaoFavoritoInput.TipoAlvoInteracao != TipoAlvoInteracaoEnum.PortfolioItem &&
                interacaoFavoritoInput.TipoAlvoInteracao != TipoAlvoInteracaoEnum.Post)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Favorito so pode ser aplicado em portfolio ou post.",
                    () => { },
                    (int)HttpStatusCode.BadRequest);
            }

            var usuarioId = await ObterUsuarioId(interacaoFavoritoInput.GoogleToken);
            await _interacaoService.SalvarAsync(usuarioId, interacaoFavoritoInput.AlvoId, interacaoFavoritoInput.TipoAlvoInteracao);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Favorito registrado com sucesso.",
                Resultado = "Favorito registrado com sucesso."
            });
        }

        [HttpDelete]
        public async Task<IActionResult> RemoverSalvamento([FromBody] InteracaoSalvamentoInput interacaoSalvamentoInput)
        {
            if (interacaoSalvamentoInput.TipoAlvoInteracao != TipoAlvoInteracaoEnum.PortfolioItem &&
                interacaoSalvamentoInput.TipoAlvoInteracao != TipoAlvoInteracaoEnum.Post)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Remover salvamento só pode ser aplicado em portfolio ou post.",
                    () => { },
                    (int)HttpStatusCode.BadRequest);
            }

            var usuarioId = await ObterUsuarioId(interacaoSalvamentoInput.GoogleToken);
            await _interacaoService.RemoverSalvarAsync(usuarioId, interacaoSalvamentoInput.AlvoId, interacaoSalvamentoInput.TipoAlvoInteracao);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Salvamento removido com sucesso.",
                Resultado = "Salvamento removido com sucesso."
            });
        }

        [HttpPost]
        public async Task<IActionResult> Seguir([FromBody] InteracaoSeguimentoInput interacaoSeguimentoInput)
        {
            var usuarioId = await ObterUsuarioId(interacaoSeguimentoInput.GoogleToken);
            await _interacaoService.SeguirAsync(usuarioId, interacaoSeguimentoInput.AlvoUsuarioId);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Seguimento registrado com sucesso.",
                Resultado = "Seguimento registrado com sucesso."
            });
        }

        [HttpDelete]
        public async Task<IActionResult> DeixarDeSeguir([FromBody] InteracaoSeguimentoInput interacaoSeguimentoInput)
        {
            var usuarioId = await ObterUsuarioId(interacaoSeguimentoInput.GoogleToken);
            await _interacaoService.DeixarDeSeguirAsync(usuarioId, interacaoSeguimentoInput.AlvoUsuarioId);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Seguimento removido com sucesso.",
                Resultado = "Seguimento removido com sucesso."
            });
        }

        [HttpPost]
        public async Task<IActionResult> Avaliar([FromBody] InteracaoAvaliacaoInput interacaoAvaliacaoInput)
        {
            var usuarioId = await ObterUsuarioId(interacaoAvaliacaoInput.GoogleToken);
            await _interacaoService.AvaliarAsync(usuarioId, interacaoAvaliacaoInput.PerfilId, interacaoAvaliacaoInput.Valor);

            return StatusCode((int)HttpStatusCode.OK, new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = "Avaliacao registrada com sucesso.",
                Resultado = "Avaliacao registrada com sucesso."
            });
        }

        private async Task<int> ObterUsuarioId(string tokenGoogle)
        {
            var usuario = await _usuarioService.ObterUsuarioPorToken(new DTO.Input.UsuarioController.ValidarUsuarioGoogleInput
            {
                TokenGoogle = tokenGoogle
            });
            return usuario.Id;
        }
    }
}
