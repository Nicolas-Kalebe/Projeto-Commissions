namespace SMT.Back.Comissoes.Models.Entity
{
    public class Servicos
    {
        public int Id { get; set; }
        public int AristaId { get; set; }
        public Artista Artista { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public TermoDeServico DescricaoTermos { get; set; }
        public decimal Preco { get; set; }
        public TimeSpan PrazoEntrega { get; set; }
        public bool Ativo { get; set; }
    }
}
