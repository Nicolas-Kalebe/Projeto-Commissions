using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SMT.Back.Comissoes.Migrations
{
    /// <inheritdoc />
    public partial class atualizacoesTabelas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AristaId",
                table: "Servicos");

            migrationBuilder.DropColumn(
                name: "PrazoEntrega",
                table: "Servicos");

            migrationBuilder.DropColumn(
                name: "UrlArquivo",
                table: "PortfolioItem");

            migrationBuilder.AddColumn<List<string>>(
                name: "Card",
                table: "Servicos",
                type: "text[]",
                nullable: false);

            migrationBuilder.AddColumn<List<string>>(
                name: "Hashtags",
                table: "PortfolioItem",
                type: "text[]",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PortfolioItemImagem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PortfolioItemId = table.Column<int>(type: "integer", nullable: false),
                    UrlArquivo = table.Column<string>(type: "text", nullable: false),
                    Ordem = table.Column<int>(type: "integer", nullable: false),
                    Principal = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioItemImagem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PortfolioItemImagem_PortfolioItem_PortfolioItemId",
                        column: x => x.PortfolioItemId,
                        principalTable: "PortfolioItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ServicosImagem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ServicoId = table.Column<int>(type: "integer", nullable: false),
                    UrlImagem = table.Column<string>(type: "text", nullable: false),
                    ServicosId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServicosImagem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServicosImagem_Servicos_ServicosId",
                        column: x => x.ServicosId,
                        principalTable: "Servicos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioItemImagem_PortfolioItemId",
                table: "PortfolioItemImagem",
                column: "PortfolioItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ServicosImagem_ServicosId",
                table: "ServicosImagem",
                column: "ServicosId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PortfolioItemImagem");

            migrationBuilder.DropTable(
                name: "ServicosImagem");

            migrationBuilder.DropColumn(
                name: "Card",
                table: "Servicos");

            migrationBuilder.DropColumn(
                name: "Hashtags",
                table: "PortfolioItem");

            migrationBuilder.AddColumn<int>(
                name: "AristaId",
                table: "Servicos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "PrazoEntrega",
                table: "Servicos",
                type: "interval",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "UrlArquivo",
                table: "PortfolioItem",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
