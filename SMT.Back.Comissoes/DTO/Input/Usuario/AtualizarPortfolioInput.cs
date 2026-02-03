namespace SMT.Back.Comissoes.DTO.Input.UsuarioController
{
    public class AtualizarPortfolioInput
    {
        public ObterArtistaInput GoogleToken { get; set; }
        public IFormFile? Imagem { get; set; }
        public List<IFormFile>? Imagens { get; set; }
        public string? Titulo { get; set; }
        public List<string>? Titulos { get; set; }
        public string? Descricao { get; set; }
        public List<string>? Descricoes { get; set; }
        }
}
