using Microsoft.EntityFrameworkCore;
using SMT.Back.Comissoes.Data;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Repositories.Interfaces;

namespace SMT.Back.Comissoes.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly DbContextClass _context;

        public UsuarioRepository(DbContextClass context)
        {
            _context = context;
        }

        public async Task<bool> VerificaUsuarioExistePorEmail(string email)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email);
            return usuario != null;
        }

        public async Task<bool> VerificaUsuarioExistePorNomePerfil(string nomeUsuario)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.NomePerfil == nomeUsuario);
            return usuario != null;
        }

        public async Task CadastrarUsuario(Usuario usuario)
        {
            await _context.Usuarios.AddAsync(usuario);
            await _context.SaveChangesAsync();
        }
    }
}