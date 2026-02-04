using SMT.Back.Comissoes.Models.Entity;

namespace SMT.Back.Comissoes.DTO.Input.Usuario
{
    public class AtualizarRedesSociaisInput
    {
        public string TokenGoogle { get; set; }
        public string RedeSocial { get; set; }
        public string Usuario { get; set; }
    }
}
