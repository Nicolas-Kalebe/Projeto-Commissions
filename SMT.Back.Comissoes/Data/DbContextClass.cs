using Microsoft.EntityFrameworkCore;
using SMT.Back.Comissoes.Models.Entity;

namespace SMT.Back.Comissoes.Data;

public class DbContextClass(DbContextOptions<DbContextClass> options) : DbContext(options)
{
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Artista> Artistas { get; set; }
    public DbSet<Interacao> Interacao { get; set; }
    public DbSet<CodigoVerificacaoEmail> CodigosVerificacaoEmail { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Interacao>()
            .HasIndex(i => new { i.UsuarioId, i.AlvoId, i.TipoAlvoInteracao, i.TipoInteracao })
            .IsUnique();

        modelBuilder.Entity<Artista>()
            .HasOne(a => a.Usuario)
            .WithOne()
            .HasForeignKey<Artista>(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email);

        modelBuilder.Entity<CodigoVerificacaoEmail>()
            .HasIndex(c => c.Email);

        modelBuilder.Entity<RefreshToken>()
            .HasIndex(r => r.TokenHash)
            .IsUnique();

        modelBuilder.Entity<RefreshToken>()
            .HasOne(r => r.Usuario)
            .WithMany()
            .HasForeignKey(r => r.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }
}
