namespace SMT.Back.Comissoes.DTO.Input.Usuario
{
    public class CadastrarServicoUsuarioInput
    {
        public string TokenGoogle { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public string DescricaoTermos { get; set; }
        public decimal Preco { get; set; }
        public TimeSpan PrazoEntrega { get; set; }
    }
}
