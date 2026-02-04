namespace SMT.Back.Comissoes.DTO.Input.Usuario
{
    public class AtualizarPerfilUsuarioInput
    {
        public string TokenGoogle { get; set; }
        public string? NomePerfil { get; set; }
        //public string? Pronomes { get; set; }
        //public string? Cargo { get; set; }
        public string? Bio { get; set; }
        public string? EstiloDescricao { get; set; }
        //public string? PrazoMedioEntrega { get; set; }
        //public List<string>? TagsEstilo { get; set; }
    }
}
