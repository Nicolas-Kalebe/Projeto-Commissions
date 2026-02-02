using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SMT.Back.Comissoes.Migrations
{
    /// <inheritdoc />
    public partial class CorrigindoTabelasInteracoes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PortfolioItem_ArtistaId",
                table: "PortfolioItem");

            migrationBuilder.AddColumn<int>(
                name: "FavoritoCount",
                table: "PortfolioItem",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LikeCount",
                table: "PortfolioItem",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VisualizacaoCount",
                table: "PortfolioItem",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Interacao",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    TipoInteracao = table.Column<int>(type: "integer", nullable: false),
                    TipoAlvoInteracao = table.Column<int>(type: "integer", nullable: false),
                    AlvoId = table.Column<int>(type: "integer", nullable: false),
                    Valor = table.Column<int>(type: "integer", nullable: true),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Interacao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Interacao_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioItem_ArtistaId",
                table: "PortfolioItem",
                column: "ArtistaId");

            migrationBuilder.CreateIndex(
                name: "IX_Interacao_UsuarioId_AlvoId_TipoAlvoInteracao_TipoInteracao",
                table: "Interacao",
                columns: new[] { "UsuarioId", "AlvoId", "TipoAlvoInteracao", "TipoInteracao" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Interacao");

            migrationBuilder.DropIndex(
                name: "IX_PortfolioItem_ArtistaId",
                table: "PortfolioItem");

            migrationBuilder.DropColumn(
                name: "FavoritoCount",
                table: "PortfolioItem");

            migrationBuilder.DropColumn(
                name: "LikeCount",
                table: "PortfolioItem");

            migrationBuilder.DropColumn(
                name: "VisualizacaoCount",
                table: "PortfolioItem");

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioItem_ArtistaId",
                table: "PortfolioItem",
                column: "ArtistaId",
                unique: true);
        }
    }
}
