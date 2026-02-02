using Microsoft.EntityFrameworkCore;
using SMT.Back.Comissoes.Data;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;
using SMT.Back.Comissoes.Repositories.Interfaces;
using System;
using System.Linq.Expressions;

namespace SMT.Back.Comissoes.Repositories
{
    public class InteracaoRepository : IInteracaoRepository
    {
        private readonly DbContextClass _context;

        public InteracaoRepository(DbContextClass context)
        {
            _context = context;
        }

        public async Task AddAsync(Interacao entity)
            => await _context.Interacao.AddAsync(entity);

        public async Task RemoveAsync(Interacao entity)
            => _context.Interacao.Remove(entity);

        public async Task<Interacao?> GetAsync(Expression<Func<Interacao, bool>> predicate)
            => await _context.Interacao.FirstOrDefaultAsync(predicate);

        public async Task<bool> ExistsAsync(Expression<Func<Interacao, bool>> predicate)
            => await _context.Interacao.AnyAsync(predicate);

        public async Task<int> CountAsync(
            TipoInteracaoEnum tipoInteracao,
            TipoAlvoInteracaoEnum tipoAlvo,
            int alvoId)
        {
            return await _context.Interacao.CountAsync(i =>
                i.TipoInteracao == tipoInteracao &&
                i.TipoAlvoInteracao == tipoAlvo &&
                i.AlvoId == alvoId
            );
        }

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
