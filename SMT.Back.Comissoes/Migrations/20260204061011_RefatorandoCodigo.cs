using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SMT.Back.Comissoes.Migrations
{
    /// <inheritdoc />
    public partial class RefatorandoCodigo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artistas_Usuarios_UsuarioId",
                table: "Artistas");

            migrationBuilder.DropForeignKey(
                name: "FK_Interacao_Usuarios_UsuarioId",
                table: "Interacao");

            migrationBuilder.DropForeignKey(
                name: "FK_Servicos_TermoDeServico_DescricaoTermosId",
                table: "Servicos");

            migrationBuilder.DropForeignKey(
                name: "FK_TermoDeServico_Artistas_ArtistaId",
                table: "TermoDeServico");

            migrationBuilder.DropIndex(
                name: "IX_TermoDeServico_ArtistaId",
                table: "TermoDeServico");

            migrationBuilder.DropIndex(
                name: "IX_Artistas_UsuarioId",
                table: "Artistas");

            migrationBuilder.DropColumn(
                name: "Card",
                table: "Servicos");

            migrationBuilder.RenameColumn(
                name: "DescricaoTermosId",
                table: "Servicos",
                newName: "TermosDeServicoId");

            migrationBuilder.RenameIndex(
                name: "IX_Servicos_DescricaoTermosId",
                table: "Servicos",
                newName: "IX_Servicos_TermosDeServicoId");

            migrationBuilder.RenameColumn(
                name: "VisualizacaoCount",
                table: "PortfolioItem",
                newName: "QuantidadeVisualizacoes");

            migrationBuilder.RenameColumn(
                name: "LikeCount",
                table: "PortfolioItem",
                newName: "QuantidadeSalvos");

            migrationBuilder.RenameColumn(
                name: "FavoritoCount",
                table: "PortfolioItem",
                newName: "QuantidadeCurtidas");

            migrationBuilder.AddForeignKey(
                name: "FK_Servicos_TermoDeServico_TermosDeServicoId",
                table: "Servicos",
                column: "TermosDeServicoId",
                principalTable: "TermoDeServico",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Servicos_TermoDeServico_TermosDeServicoId",
                table: "Servicos");

            migrationBuilder.RenameColumn(
                name: "TermosDeServicoId",
                table: "Servicos",
                newName: "DescricaoTermosId");

            migrationBuilder.RenameIndex(
                name: "IX_Servicos_TermosDeServicoId",
                table: "Servicos",
                newName: "IX_Servicos_DescricaoTermosId");

            migrationBuilder.RenameColumn(
                name: "QuantidadeVisualizacoes",
                table: "PortfolioItem",
                newName: "VisualizacaoCount");

            migrationBuilder.RenameColumn(
                name: "QuantidadeSalvos",
                table: "PortfolioItem",
                newName: "LikeCount");

            migrationBuilder.RenameColumn(
                name: "QuantidadeCurtidas",
                table: "PortfolioItem",
                newName: "FavoritoCount");

            migrationBuilder.AddColumn<List<string>>(
                name: "Card",
                table: "Servicos",
                type: "text[]",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_TermoDeServico_ArtistaId",
                table: "TermoDeServico",
                column: "ArtistaId");

            migrationBuilder.CreateIndex(
                name: "IX_Artistas_UsuarioId",
                table: "Artistas",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Artistas_Usuarios_UsuarioId",
                table: "Artistas",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Interacao_Usuarios_UsuarioId",
                table: "Interacao",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Servicos_TermoDeServico_DescricaoTermosId",
                table: "Servicos",
                column: "DescricaoTermosId",
                principalTable: "TermoDeServico",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TermoDeServico_Artistas_ArtistaId",
                table: "TermoDeServico",
                column: "ArtistaId",
                principalTable: "Artistas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
