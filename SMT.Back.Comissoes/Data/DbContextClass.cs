using Microsoft.EntityFrameworkCore;
using SMT.Back.Comissoes.Models.Entity;

namespace SMT.Back.Comissoes.Data;

public class DbContextClass(DbContextOptions<DbContextClass> options) : DbContext(options)
{
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Artista> Artistas { get; set; }
    public DbSet<Interacao> Interacao { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Interacao>()
            .HasIndex(i => new { i.UsuarioId, i.AlvoId, i.TipoAlvoInteracao, i.TipoInteracao })
            .IsUnique();

        base.OnModelCreating(modelBuilder);
    }

}
