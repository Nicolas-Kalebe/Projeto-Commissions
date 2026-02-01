namespace SMT.Back.Comissoes.DTO.Input
{
    public class AtualizarFotoUsuarioInput
    {
        public string TokenGoogle { get; set; }
        public IFormFile FotoPerfil { get; set; }  
    }
}
