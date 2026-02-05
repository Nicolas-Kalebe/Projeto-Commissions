using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SMT.Back.Comissoes.Migrations
{
    /// <inheritdoc />
    public partial class correcoesUsuariosEArtistas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TipoArtista",
                table: "Artistas");

            migrationBuilder.AddColumn<int>(
                name: "CargoArtista",
                table: "Artistas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PrazoMedioEntrega",
                table: "Artistas",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CargoArtista",
                table: "Artistas");

            migrationBuilder.DropColumn(
                name: "PrazoMedioEntrega",
                table: "Artistas");

            migrationBuilder.AddColumn<string>(
                name: "TipoArtista",
                table: "Artistas",
                type: "text",
                nullable: true);
        }
    }
}
