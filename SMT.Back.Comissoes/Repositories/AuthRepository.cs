using Microsoft.EntityFrameworkCore;
using SMT.Back.Comissoes.Data;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Repositories.Interfaces;

namespace SMT.Back.Comissoes.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DbContextClass _context;

        public AuthRepository(DbContextClass context)
        {
            _context = context;
        }

        public async Task<CodigoVerificacaoEmail?> ObterCodigoAtivoPorEmail(string email)
        {
            var emailLower = email.ToLowerInvariant();
            return await _context.CodigosVerificacaoEmail
                .Where(c => c.Email == emailLower && !c.Consumido && c.ExpiraEm > DateTime.UtcNow)
                .OrderByDescending(c => c.DataCriacao)
                .FirstOrDefaultAsync();
        }

        public async Task<CodigoVerificacaoEmail?> ObterUltimoCodigoPorEmail(string email)
        {
            var emailLower = email.ToLowerInvariant();
            return await _context.CodigosVerificacaoEmail
                .Where(c => c.Email == emailLower)
                .OrderByDescending(c => c.DataCriacao)
                .FirstOrDefaultAsync();
        }

        public async Task InvalidarCodigosAtivos(string email)
        {
            var emailLower = email.ToLowerInvariant();
            var codigos = await _context.CodigosVerificacaoEmail
                .Where(c => c.Email == emailLower && !c.Consumido)
                .ToListAsync();
            foreach (var c in codigos)
                c.Consumido = true;
            await _context.SaveChangesAsync();
        }

        public async Task CriarCodigo(CodigoVerificacaoEmail codigo)
        {
            codigo.Email = codigo.Email.ToLowerInvariant();
            await _context.CodigosVerificacaoEmail.AddAsync(codigo);
            await _context.SaveChangesAsync();
        }

        public async Task AtualizarCodigo(CodigoVerificacaoEmail codigo)
        {
            _context.CodigosVerificacaoEmail.Update(codigo);
            await _context.SaveChangesAsync();
        }

        public async Task CriarRefreshToken(RefreshToken refreshToken)
        {
            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task<RefreshToken?> ObterRefreshTokenPorHash(string tokenHash)
        {
            return await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.TokenHash == tokenHash);
        }

        public async Task AtualizarRefreshToken(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();
        }
    }
}
