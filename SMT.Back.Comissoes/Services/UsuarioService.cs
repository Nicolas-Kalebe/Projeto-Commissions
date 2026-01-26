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

        public UsuarioService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
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

            var usuarioExistente = await _usuarioRepository.VerificaUsuarioExistePorEmail(usuarioInput.Email);

            if (usuarioExistente)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DuplicidadeEncontrada,
                    "Já existe um usuário cadastrado com este email.",
                    () => Log.Error("Tentativa de cadastro com email já existente: {Email}", usuarioInput.Email),
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
                Nome = usuarioInput.Nome,
                NomePerfil = usuarioInput.NomePerfil,
                TipoUsuario = usuarioInput.TipoUsuario,
                DataNascimento = usuarioInput.DataNascimento,
                Email = usuarioInput.Email,
                SenhaHash = usuarioInput.SenhaHash,
                DataCriacao = DateTime.UtcNow,
                Status = StatusEnum.Ativo,
                JaAnunciou = false,
            };

            await _usuarioRepository.CadastrarUsuario(usuario);

            return;
        }
    }
}