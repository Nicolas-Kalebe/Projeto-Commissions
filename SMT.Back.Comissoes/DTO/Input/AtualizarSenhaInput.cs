namespace SMT.Back.Comissoes.DTO.Input
{
    public class AtualizarSenhaInput
    {
        public string Email { get; set; }
        public string SenhaAtual { get; set; }
        public string SenhaNova { get; set; }
        public string ConfirmarSenhaNova { get; set; }
    }
}
