using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;
using System.Linq.Expressions;

namespace SMT.Back.Comissoes.Repositories.Interfaces
{
    public interface IInteracaoRepository
    {
        Task AddAsync(Interacao entity);
        Task RemoveAsync(Interacao entity);
        Task<Interacao?> GetAsync(Expression<Func<Interacao, bool>> predicate);
        Task<bool> ExistsAsync(Expression<Func<Interacao, bool>> predicate);
        Task<int> CountAsync(TipoInteracaoEnum tipoInteracao, TipoAlvoInteracaoEnum tipoAlvo, int alvoId);
        Task SaveChangesAsync();
    }
}
