using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SMT.Back.Comissoes.Migrations
{
    /// <inheritdoc />
    public partial class CorrigindoPortfolio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PortifolioUrl",
                table: "Artistas");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PortifolioUrl",
                table: "Artistas",
                type: "text",
                nullable: true);
        }
    }
}
