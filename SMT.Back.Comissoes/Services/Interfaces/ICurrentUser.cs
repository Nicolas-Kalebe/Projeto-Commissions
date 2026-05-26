namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface ICurrentUser
    {
        int UsuarioId { get; }
        string Email { get; }
        string NomePerfil { get; }
    }
}
