namespace SMT.Back.Comissoes.DTO.Input.Interacao
{
    public class InteracaoAvaliacaoInput
    {
        public string GoogleToken { get; set; } = string.Empty;
        public int PerfilId { get; set; }
        public int Valor { get; set; }
    }
}
