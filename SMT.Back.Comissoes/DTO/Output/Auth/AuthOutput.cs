namespace SMT.Back.Comissoes.DTO.Output.Auth
{
    public class AuthUsuarioOutput
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string NomePerfil { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FotoPerfil { get; set; }
        public bool JaAnunciou { get; set; }
        public string Provedor { get; set; } = string.Empty;
    }

    public class AuthOutput
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
        public AuthUsuarioOutput Usuario { get; set; } = new();
    }
}
