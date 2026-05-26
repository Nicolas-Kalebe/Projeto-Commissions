using Microsoft.AspNetCore.Mvc;
using SMT.Back.Comissoes.DTO.Input.Interacao;
using SMT.Back.Comissoes.Models;
using SMT.Back.Comissoes.Models.Enum;
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
        private readonly ICurrentUser _currentUser;

        public InteracaoController(IInteracaoService interacaoService, ICurrentUser currentUser)
        {
            _interacaoService = interacaoService;
            _currentUser = currentUser;
        }

        [HttpPost]
        public async Task<IActionResult> Curtir([FromBody] InteracaoCurtidaInput input)
        {
            ValidarAlvoPortfolioOuPost(input.TipoAlvoInteracao, "Curtir");
            await _interacaoService.CurtirAsync(_currentUser.UsuarioId, input.AlvoId, input.TipoAlvoInteracao);
            return Ok(MontarRetorno("Like registrado com sucesso."));
        }

        [HttpDelete]
        public async Task<IActionResult> Descurtir([FromBody] InteracaoCurtidaInput input)
        {
            ValidarAlvoPortfolioOuPost(input.TipoAlvoInteracao, "Descurtir");
            await _interacaoService.DescurtirAsync(_currentUser.UsuarioId, input.AlvoId, input.TipoAlvoInteracao);
            return Ok(MontarRetorno("Like removido com sucesso."));
        }

        [HttpPost]
        public async Task<IActionResult> Salvar([FromBody] InteracaoSalvamentoInput input)
        {
            ValidarAlvoPortfolioOuPost(input.TipoAlvoInteracao, "Salvar");
            await _interacaoService.SalvarAsync(_currentUser.UsuarioId, input.AlvoId, input.TipoAlvoInteracao);
            return Ok(MontarRetorno("Favorito registrado com sucesso."));
        }

        [HttpDelete]
        public async Task<IActionResult> RemoverSalvamento([FromBody] InteracaoSalvamentoInput input)
        {
            ValidarAlvoPortfolioOuPost(input.TipoAlvoInteracao, "Remover salvamento");
            await _interacaoService.RemoverSalvarAsync(_currentUser.UsuarioId, input.AlvoId, input.TipoAlvoInteracao);
            return Ok(MontarRetorno("Salvamento removido com sucesso."));
        }

        [HttpPost]
        public async Task<IActionResult> Seguir([FromBody] InteracaoSeguimentoInput input)
        {
            await _interacaoService.SeguirAsync(_currentUser.UsuarioId, input.AlvoUsuarioId);
            return Ok(MontarRetorno("Seguimento registrado com sucesso."));
        }

        [HttpDelete]
        public async Task<IActionResult> DeixarDeSeguir([FromBody] InteracaoSeguimentoInput input)
        {
            await _interacaoService.DeixarDeSeguirAsync(_currentUser.UsuarioId, input.AlvoUsuarioId);
            return Ok(MontarRetorno("Seguimento removido com sucesso."));
        }

        [HttpPost]
        public async Task<IActionResult> Avaliar([FromBody] InteracaoAvaliacaoInput input)
        {
            await _interacaoService.AvaliarAsync(_currentUser.UsuarioId, input.PerfilId, input.Valor);
            return Ok(MontarRetorno("Avaliacao registrada com sucesso."));
        }

        private static void ValidarAlvoPortfolioOuPost(TipoAlvoInteracaoEnum tipo, string acao)
        {
            if (tipo != TipoAlvoInteracaoEnum.PortfolioItem && tipo != TipoAlvoInteracaoEnum.Post)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    $"{acao} so pode ser aplicado em portfolio ou post.",
                    () => { },
                    (int)HttpStatusCode.BadRequest);
        }

        private static RetornoPadrao<object> MontarRetorno(string mensagem)
        {
            return new RetornoPadrao<object>
            {
                Codigo = ConstantesCodigoRetornoPadrao.SucessoPadrao,
                StatusHttp = (int)HttpStatusCode.OK,
                Mensagem = mensagem,
                Resultado = mensagem
            };
        }
    }
}
