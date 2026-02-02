namespace SMT.Back.Comissoes.Models.Entity
{
    public class Post
    {
        public int Id { get; set; }
        public string Conteudo { get; set; }
        public int LikeCount { get; set; }
        public int FavoritoCount { get; set; }
        public int VisualizacaoCount { get; set; }
        public DateTime DataCriacao { get; set; }
    }
}
