using Microsoft.EntityFrameworkCore;
using SMT.Back.Comissoes.Models.Entity;

namespace SMT.Back.Comissoes.Data;

public class DbContextClass(DbContextOptions<DbContextClass> options) : DbContext(options)
{
    public DbSet<Usuario> Usuarios { get; set; }
}