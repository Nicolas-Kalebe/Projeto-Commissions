using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;
using SMT.Back.Comissoes.Repositories.Interfaces;
using SMT.Back.Comissoes.Services.Interfaces;

namespace SMT.Back.Comissoes.Services
{
    // InteracaoService
    public class InteracaoService : IInteracaoService
    {
        private readonly IInteracaoRepository _repository;

        public InteracaoService(IInteracaoRepository repository)
        {
            _repository = repository;
        }

        public async Task LikeAsync(int usuarioId, int portfolioItemId)
        {
            await AddUniqueInteraction(usuarioId, portfolioItemId, TipoAlvoInteracaoEnum.PortfolioItem, TipoInteracaoEnum.Like);
        }

        public async Task FavoritarAsync(int usuarioId, int alvoId, TipoAlvoInteracaoEnum tipoAlvo)
        {
            await AddUniqueInteraction(usuarioId, alvoId, tipoAlvo, TipoInteracaoEnum.Favorito);
        }

        public async Task DesfavoritarAsync(int usuarioId, int alvoId, TipoAlvoInteracaoEnum tipoAlvo)
        {
            await RemoveInteraction(usuarioId, alvoId, tipoAlvo, TipoInteracaoEnum.Favorito);
        }

        public async Task SeguirAsync(int usuarioId, int perfilId)
        {
            await AddUniqueInteraction(usuarioId, perfilId, TipoAlvoInteracaoEnum.PerfilArtista, TipoInteracaoEnum.Seguir);
        }

        public async Task DeixarDeSeguirAsync(int usuarioId, int perfilId)
        {
            await RemoveInteraction(usuarioId, perfilId, TipoAlvoInteracaoEnum.PerfilArtista, TipoInteracaoEnum.Seguir);
        }

        public async Task AvaliarAsync(int usuarioId, int perfilId, int valor)
        {
            if (valor < 1 || valor > 5)
                throw new Exception("Avaliação inválida");

            var interacao = await _repository.GetAsync(i =>
                i.UsuarioId == usuarioId &&
                i.AlvoId == perfilId &&
                i.TipoAlvoInteracao == TipoAlvoInteracaoEnum.PerfilArtista &&
                i.TipoInteracao == TipoInteracaoEnum.Avaliacao
            );

            if (interacao == null)
            {
                await _repository.AddAsync(new Interacao
                {
                    UsuarioId = usuarioId,
                    AlvoId = perfilId,
                    TipoAlvoInteracao = TipoAlvoInteracaoEnum.PerfilArtista,
                    TipoInteracao = TipoInteracaoEnum.Avaliacao,
                    Valor = valor,
                    DataCriacao = DateTime.UtcNow
                });
            }
            else
            {
                interacao.Valor = valor;
            }

            await _repository.SaveChangesAsync();
        }

        private async Task AddUniqueInteraction(
            int usuarioId,
            int alvoId,
            TipoAlvoInteracaoEnum tipoAlvo,
            TipoInteracaoEnum tipoInteracao)
        {
            bool exists = await _repository.ExistsAsync(i =>
                i.UsuarioId == usuarioId &&
                i.AlvoId == alvoId &&
                i.TipoAlvoInteracao == tipoAlvo &&
                i.TipoInteracao == tipoInteracao
            );

            if (exists) return;

            await _repository.AddAsync(new Interacao
            {
                UsuarioId = usuarioId,
                AlvoId = alvoId,
                TipoAlvoInteracao = tipoAlvo,
                TipoInteracao = tipoInteracao,
                DataCriacao = DateTime.UtcNow
            });

            await _repository.SaveChangesAsync();
        }

        private async Task RemoveInteraction(
            int usuarioId,
            int alvoId,
            TipoAlvoInteracaoEnum tipoAlvo,
            TipoInteracaoEnum tipoInteracao)
        {
            var interacao = await _repository.GetAsync(i =>
                i.UsuarioId == usuarioId &&
                i.AlvoId == alvoId &&
                i.TipoAlvoInteracao == tipoAlvo &&
                i.TipoInteracao == tipoInteracao
            );

            if (interacao == null) return;

            await _repository.RemoveAsync(interacao);
            await _repository.SaveChangesAsync();
        }
    }

}
