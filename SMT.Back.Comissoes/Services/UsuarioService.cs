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
        private readonly IBucketService _bucketService;
        public UsuarioService(IUsuarioRepository usuarioRepository, IAuthService authService, IBucketService bucketService)
        {
            _usuarioRepository = usuarioRepository;
            _authService = authService;
            _bucketService = bucketService;
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
                FotoPerfil = userGoogle.Picture, // vem do google
                DataCriacao = DateTime.UtcNow, 
                Status = StatusEnum.Ativo,
                JaAnunciou = false,
            };

            await _usuarioRepository.CadastrarUsuario(usuario);

            return;
        }
        public async Task AutenticarUsuario(AutenticarUsuarioInput autenticarUsuarioInput)
        {
            try
            {
                var usuario = await _authService.ValidarTokenGoogle(autenticarUsuarioInput.TokenGoogle);
                var usuarioCadastrado = await _usuarioRepository.ObterUsuarioPorEmail(usuario.Email);
                if (usuarioCadastrado == null) {
                    throw new ExcecaoPersonalizada(
                        ConstantesCodigoRetornoPadrao.RecursoNaoEncontrado,
                        "Usuário não encontrado.",
                        () => Log.Error($"Usuário não encontrado para o email: {usuario.Email}"),
                        (int)System.Net.HttpStatusCode.NotFound
                    );
                }
            } catch (Exception ex) {
                Log.Error($"Erro ao autenticar usuário: {ex.Message}");
                throw;
            }
        }
        public async Task<Usuario> ObterUsuarioPorToken(ObterTokenGoogleInput obterTokenGoogleInput)
        {
            var userGoogle = await _authService.ValidarTokenGoogle(obterTokenGoogleInput.TokenGoogle);
            var usuario = await _usuarioRepository.ObterUsuarioPorEmail(userGoogle.Email);
            if (usuario == null)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.RecursoNaoEncontrado,
                    "Usuário não encontrado.",
                    () => Log.Error($"Usuário não encontrado para o email: {userGoogle.Email}"),
                    (int)System.Net.HttpStatusCode.NotFound
                );
            return usuario;
        }
        public async Task<StatusEnum> ObterStatusUsuario(ObterStatusInput obterStatusInput)
        {
            var userGoogle = await _authService.ValidarTokenGoogle(obterStatusInput.GoogleToken);
            var usuarioStatus = await _usuarioRepository.ObterStatusUsuario(userGoogle.Email);
            return usuarioStatus;
        }
        public async Task CadastrarArtista(CadastrarArtistaInput cadastrarArtistaInput)
        {
            await _usuarioRepository.ObterUsuarioPorId(cadastrarArtistaInput.PerfilId);
            var usuario = await _usuarioRepository.ObterUsuarioPorId(cadastrarArtistaInput.PerfilId);
            var artista = new Artista
            {
                UsuarioId = usuario.Id,
            };
            usuario.JaAnunciou = true;
            await _usuarioRepository.CadastrarArtista(artista);
        }

        public async Task<Artista> ObterPerfilArtista(ObterArtistaInput obterArtistaInput)
        {
            var userGoogle = await _authService.ValidarTokenGoogle(obterArtistaInput.GoogleToken);
            var usuario = await _usuarioRepository.ObterUsuarioPorEmail(userGoogle.Email);
            if (usuario == null)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.RecursoNaoEncontrado,
                    "Usuário não encontrado.",
                    () => Log.Error("Usuário não encontrado para o email: {Email}", userGoogle.Email),
                    (int)System.Net.HttpStatusCode.NotFound
                );
            var artista = await _usuarioRepository.ObterArtistaPorUsuarioId(usuario.Id);
            if (artista == null)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.RecursoNaoEncontrado,
                    "Perfil de artista não encontrado para o usuário.",
                    () => Log.Error("Perfil de artista não encontrado para o usuário ID: {UsuarioId}", usuario.Id),
                    (int)System.Net.HttpStatusCode.NotFound
                );
            return artista;
        }
        public async Task AtualizarPortfolioAsync(AtualizarPortfolioInput atualizarPortfolioInput)
        {
            var artista = await ObterPerfilArtista(atualizarPortfolioInput.GoogleToken);

            if (atualizarPortfolioInput.Imagem == null || atualizarPortfolioInput.Imagem.Length == 0)
                throw new ArgumentException("Nenhuma imagem enviada.");

            // Validação de tipo
            if (!atualizarPortfolioInput.Imagem.ContentType.StartsWith("image/"))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Tipo de dado inválido, insira uma imagem/gif",
                    () => Log.Error($"Tipo de dado inválido para imagem de portfolio do artista Email: {artista.Usuario.NomePerfil}"),
                    (int)System.Net.HttpStatusCode.BadRequest);

            // Path no bucket organizado por usuário
            var pathBucket = $"portfolios/usuarios/{artista.Usuario.NomePerfil}/main.webp";

            // Upload da imagem
            var pathCompleto = await _bucketService.UploadAsync(atualizarPortfolioInput.Imagem, pathBucket);

            // Atualiza apenas o path no banco            
            await _usuarioRepository.AtualizarPortfolioArtista(artista.Id, pathCompleto);
        }
        public async Task<string> AtualizarFotoUsuario(AtualizarFotoUsuarioInput atualizarFotoUsuarioInput)
        {
            var userGoogle = await _authService.ValidarTokenGoogle(atualizarFotoUsuarioInput.TokenGoogle);
            var usuario = await _usuarioRepository.ObterUsuarioPorEmail(userGoogle.Email);
            if (usuario == null)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.RecursoNaoEncontrado,
                    "Usuário não encontrado.",
                    () => Log.Error($"Usuário não encontrado para o email: {userGoogle.Email}"),
                    (int)System.Net.HttpStatusCode.NotFound
                );
            if (atualizarFotoUsuarioInput.FotoPerfil == null || atualizarFotoUsuarioInput.FotoPerfil.Length == 0)
                throw new ArgumentException("Nenhuma imagem enviada.");
            // Validação de tipo
            if (!atualizarFotoUsuarioInput.FotoPerfil.ContentType.StartsWith("image/"))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Tipo de dado inválido, insira uma imagem/gif",
                    () => Log.Error($"Tipo de dado inválido para foto de perfil do usuário Email: {usuario.NomePerfil}"),
                    (int)System.Net.HttpStatusCode.BadRequest);
            // Path no bucket organizado por usuário
            var pathBucket = $"usuarios/{usuario.NomePerfil}/foto_perfil.webp";
            // Upload da imagem
            var pathCompleto = await _bucketService.UploadAsync(atualizarFotoUsuarioInput.FotoPerfil, pathBucket);
            // Atualiza apenas o path no banco            
            await _usuarioRepository.AtualizarFotoPerfil(usuario.Id, pathCompleto);
            return pathCompleto;
        }
    }
}