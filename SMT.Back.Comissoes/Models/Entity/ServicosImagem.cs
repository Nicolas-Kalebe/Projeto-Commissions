namespace SMT.Back.Comissoes.Models.Entity
{
    public class ServicosImagem
    {
        public int Id { get; set; }
        public int ServicoId { get; set; }
        public string UrlImagem { get; set; } = string.Empty;
    }
}
