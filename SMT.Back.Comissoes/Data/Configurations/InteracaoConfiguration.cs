using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMT.Back.Comissoes.Models.Entity;

namespace SMT.Back.Comissoes.Data.Configurations
{
    public class InteracaoConfiguration : IEntityTypeConfiguration<Interacao>
    {
        public void Configure(EntityTypeBuilder<Interacao> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasIndex(x => new
            {
                x.UsuarioId,
                x.AlvoId,
                x.TipoAlvoInteracao,
                x.TipoInteracao
            }).IsUnique();

            builder.Property(x => x.TipoInteracao).IsRequired();
            builder.Property(x => x.TipoAlvoInteracao).IsRequired();
        }
    }
}
