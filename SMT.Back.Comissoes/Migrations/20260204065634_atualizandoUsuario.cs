using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SMT.Back.Comissoes.Migrations
{
    /// <inheritdoc />
    public partial class atualizandoUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EstiloDescricao",
                table: "Usuarios",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstiloDescricao",
                table: "Usuarios");
        }
    }
}
