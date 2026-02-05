using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SMT.Back.Comissoes.Migrations
{
    /// <inheritdoc />
    public partial class correcoesGerais : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstiloDescricao",
                table: "Usuarios");

            migrationBuilder.AddColumn<int>(
                name: "Pronome",
                table: "Usuarios",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Pronome",
                table: "Usuarios");

            migrationBuilder.AddColumn<string>(
                name: "EstiloDescricao",
                table: "Usuarios",
                type: "text",
                nullable: true);
        }
    }
}
