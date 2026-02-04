using Microsoft.EntityFrameworkCore;
using SMT.Back.Comissoes.Data;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Repositories.Interfaces;
using SMT.Back.Comissoes.Utils;
using Serilog;
using SMT.Back.Comissoes.Models.Enum;

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
        
        public async Task<StatusEnum> ObterStatusUsuario(string email)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email);
            if(usuario != null)
            {
                return usuario.Status;
            }
            return StatusEnum.Inativo;
        }
        public async Task<Usuario> ObterUsuarioPorId(int id)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Id == id);
            if (usuario == null)
            {
                Log.Error($"Usuário com ID {id} não encontrado.");
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.RecursoNaoEncontrado,
                    $"Usuário com Id:{id} não encontrado",
                    () => Log.Error($"Erro: Usuário com ID {id} não foi localizado no banco de dados."),
                    (int)System.Net.HttpStatusCode.NotFound
                );
            }
            return usuario;
        }
        public async Task<Usuario> ObterUsuarioPorEmail(string email)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.RedesSociais)
                .FirstOrDefaultAsync(u => u.Email == email);
            return usuario;
        }
        public async Task<Artista> ObterArtistaPorUsuarioId(int usuarioId)
        {
            var artista = await _context.Artistas
                .AsNoTracking()
                .Include(a => a.Usuario)
                .Include(a => a.PortfolioItens)
                .FirstOrDefaultAsync(a => a.UsuarioId == usuarioId);
            return artista;
        }

        public async Task CadastrarArtista(Artista artista)
        {
            await _context.Artistas.AddAsync(artista);
            await _context.SaveChangesAsync();
        }
        public async Task CadastrarPortfolioArtista(int artistaId, PortfolioItem portfolioItem)
        {
            var artista = await _context.Artistas
                .Include(a => a.PortfolioItens)
                .FirstOrDefaultAsync(a => a.Id == artistaId);

            if (artista == null)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.RecursoNaoEncontrado,
                    $"Artista com Id:{artistaId} não encontrado",
                    () => Log.Error($"Erro: Artista com ID {artistaId} não foi localizado no banco de dados."),
                    (int)System.Net.HttpStatusCode.NotFound
                );
            artista.PortfolioItens.Add(portfolioItem);
            await _context.SaveChangesAsync();
        }
        public async Task AtualizarFotoPerfil(int usuarioId, string fotoPerfilUrl, TipoFotoPerfilEnum tipoFotoPerfilEnum)
        {
            var usuario = await _context.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.RecursoNaoEncontrado,
                    $"Usuário com Id:{usuario.Id} não encontrado",
                    () => Log.Error($"Erro: Usuário com ID {usuario.Id} não foi localizado no banco de dados."),
                    (int)System.Net.HttpStatusCode.NotFound
                );
            }
            if (tipoFotoPerfilEnum == TipoFotoPerfilEnum.FotoCapa) usuario.FotoCapa = fotoPerfilUrl;
                else if (tipoFotoPerfilEnum == TipoFotoPerfilEnum.FotoPerfil){
                usuario.FotoPerfil = fotoPerfilUrl;
                }
                await _context.SaveChangesAsync();
        }
        public async Task AtualizarRedesSociais(RedeSocial redesSociais)
        {
            var usuario = await _context.Usuarios.FindAsync(redesSociais.UsuarioId);
            if (usuario == null)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.RecursoNaoEncontrado,
                    $"Usuário com Id:{redesSociais.UsuarioId} não encontrado",
                    () => Log.Error($"Erro: Usuário com ID {redesSociais.UsuarioId} não foi localizado no banco de dados."),
                    (int)System.Net.HttpStatusCode.NotFound
                );
            }
            usuario.RedesSociais.Add(redesSociais);
            await _context.SaveChangesAsync();
        }
    }
}
