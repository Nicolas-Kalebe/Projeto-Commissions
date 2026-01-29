namespace SMT.Back.Comissoes.DTO.Input
{
    public class AtualizarPortfolioInput
    {
        public ObterArtistaInput GoogleToken { get; set; }
        public IFormFile Imagem { get; set; }
        public string Tipo { get; set; }     // capa, galeria
    }
}
