using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SMT.Back.Comissoes.Migrations
{
    /// <inheritdoc />
    public partial class AdicionandoRedeSocial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Servicos_TermosDeServico_DescricaoTermosId",
                table: "Servicos");

            migrationBuilder.DropForeignKey(
                name: "FK_TermosDeServico_Artistas_ArtistaId",
                table: "TermosDeServico");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TermosDeServico",
                table: "TermosDeServico");

            migrationBuilder.RenameTable(
                name: "TermosDeServico",
                newName: "TermoDeServico");

            migrationBuilder.RenameIndex(
                name: "IX_TermosDeServico_ArtistaId",
                table: "TermoDeServico",
                newName: "IX_TermoDeServico_ArtistaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TermoDeServico",
                table: "TermoDeServico",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "RedeSocial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Titulo = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RedeSocial", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RedeSocial_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RedeSocial_UsuarioId",
                table: "RedeSocial",
                column: "UsuarioId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Servicos_TermoDeServico_DescricaoTermosId",
                table: "Servicos");

            migrationBuilder.DropForeignKey(
                name: "FK_TermoDeServico_Artistas_ArtistaId",
                table: "TermoDeServico");

            migrationBuilder.DropTable(
                name: "RedeSocial");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TermoDeServico",
                table: "TermoDeServico");

            migrationBuilder.RenameTable(
                name: "TermoDeServico",
                newName: "TermosDeServico");

            migrationBuilder.RenameIndex(
                name: "IX_TermoDeServico_ArtistaId",
                table: "TermosDeServico",
                newName: "IX_TermosDeServico_ArtistaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TermosDeServico",
                table: "TermosDeServico",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Servicos_TermosDeServico_DescricaoTermosId",
                table: "Servicos",
                column: "DescricaoTermosId",
                principalTable: "TermosDeServico",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TermosDeServico_Artistas_ArtistaId",
                table: "TermosDeServico",
                column: "ArtistaId",
                principalTable: "Artistas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
