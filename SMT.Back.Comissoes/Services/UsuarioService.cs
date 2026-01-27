using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Utils;
using Serilog;
using SMT.Back.Comissoes.Repositories.Interfaces;
using SMT.Back.Comissoes.DTO.Input;
using SMT.Back.Comissoes.Models.Enum;
using SMT.Back.Comissoes.Services.Interfaces;

namespace SMT.Back.Comissoes.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IAuthService _authService;
        public UsuarioService(IUsuarioRepository usuarioRepository, IAuthService authService)
        {
            _usuarioRepository = usuarioRepository;
            _authService = authService;
        }

        public async Task CadastrarUsuario(CadastrarUsuarioInput usuarioInput)
        {
            if (usuarioInput == null)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DadoNulo,
                    "Dados do usuário não podem ser nulos.",
                    () => Log.Error("Tentativa de cadastro com dados de usuário nulos"),
                    (int)System.Net.HttpStatusCode.BadRequest
                );

            var userGoogle = await _authService.ValidarTokenGoogle(usuarioInput.TokenGoogle);

            var usuarioExistente = await _usuarioRepository.VerificaUsuarioExistePorEmail(userGoogle.Email);

            if (usuarioExistente)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DuplicidadeEncontrada,
                    "Já existe um usuário cadastrado com este email.",
                    () => Log.Error("Tentativa de cadastro com email já existente: {Email}", userGoogle.Email),
                    (int)System.Net.HttpStatusCode.Conflict
                );

            var nomePerfilExistente = await _usuarioRepository.VerificaUsuarioExistePorNomePerfil(usuarioInput.NomePerfil);

            if (nomePerfilExistente)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DuplicidadeEncontrada,
                    "Já existe um usuário cadastrado com este nome de perfil.",
                    () => Log.Error($"Tentativa de cadastro com nome de perfil já existente: {usuarioInput.NomePerfil}"),
                    (int)System.Net.HttpStatusCode.Conflict
                );
            var usuario = new Usuario
            {
                Nome = userGoogle.Name, // vem do google
                NomePerfil = usuarioInput.NomePerfil, // payload front
                DataNascimento = usuarioInput.DataNascimento, // payload front
                Email = userGoogle.Email, // vem do google
                DataCriacao = DateTime.UtcNow, 
                Status = StatusEnum.Ativo,
                JaAnunciou = false,
            };

            await _usuarioRepository.CadastrarUsuario(usuario);

            return;
        }
        public async Task<StatusEnum> ObterStatusUsuario(ObterStatusInput obterStatusInput)
        {
            var userGoogle = await _authService.ValidarTokenGoogle(obterStatusInput.GoogleToken);

            var usuario = await _usuarioRepository.ObterStatusUsuario(userGoogle.Email);
            return usuario;
        }
        //public async Task CadastrarArtista(Artista artista)
        //{
        //    await _usuarioRepository.CadastrarArtista(artista);
        //}
    }
}