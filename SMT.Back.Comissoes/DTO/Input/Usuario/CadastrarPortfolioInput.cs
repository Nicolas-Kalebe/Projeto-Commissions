namespace SMT.Back.Comissoes.DTO.Input.UsuarioController
{
    public class CadastrarPortfolioInput
    {
        public ObterArtistaInput GoogleToken { get; set; }
        public IFormFile? Imagem { get; set; }
        public List<IFormFile>? Imagens { get; set; }
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }
        public List<string>? Hashtags { get; set; } = new List<string>();
    }
}
