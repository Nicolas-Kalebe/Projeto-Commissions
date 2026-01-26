namespace SMT.Back.Comissoes.Models
{
    public class RetornoPadrao<T> where T: class, new()
    {
        public int StatusHttp { get; set; }
        public string Codigo { get; set; }
        public string Mensagem { get; set; }
        public T Resultado { get; set; } = new T();

    }
}
