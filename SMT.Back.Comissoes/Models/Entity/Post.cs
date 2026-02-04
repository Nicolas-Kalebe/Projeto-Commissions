namespace SMT.Back.Comissoes.Models.Entity
{
    public class Post
    {
        public int Id { get; set; }
        public string Conteudo { get; set; } = string.Empty;
        public int QuantidadeCurtidas { get; set; }
        public int QuantidadeSalvos { get; set; }
        public int QuantidadeVisualizacoes { get; set; }
        public DateTime DataCriacao { get; set; }
    }
}
