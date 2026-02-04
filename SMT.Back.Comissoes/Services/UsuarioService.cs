using Serilog;
using SMT.Back.Comissoes.DTO.Input.Usuario;
using SMT.Back.Comissoes.DTO.Input.UsuarioController;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;
using SMT.Back.Comissoes.Repositories.Interfaces;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.Net;
using static System.Net.Mime.MediaTypeNames;

namespace SMT.Back.Comissoes.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IAuthService _authService;
        private readonly IBucketService _bucketService;
        private readonly IInteracaoRepository _interacaoRepository;
        public UsuarioService(IUsuarioRepository usuarioRepository, IAuthService authService, IBucketService bucketService, IInteracaoRepository interacaoRepository)
        {
            _usuarioRepository = usuarioRepository;
            _authService = authService;
            _bucketService = bucketService;
            _interacaoRepository = interacaoRepository;
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
        public async Task<Usuario> ObterUsuarioPorToken(ValidarUsuarioGoogleInput obterTokenGoogleInput)
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
            if (!string.IsNullOrWhiteSpace(usuario.FotoPerfil))
            {
                var signedUrl = _bucketService.GetPresignedUrl(usuario.FotoPerfil, TimeSpan.FromHours(6));
                if (!string.IsNullOrWhiteSpace(signedUrl))
                    usuario.FotoPerfil = signedUrl;
            }
            if (!string.IsNullOrWhiteSpace(usuario.FotoCapa))
            {
                var signedUrl = _bucketService.GetPresignedUrl(usuario.FotoCapa, TimeSpan.FromHours(6));
                if (!string.IsNullOrWhiteSpace(signedUrl))
                    usuario.FotoCapa = signedUrl;
            }
            usuario.Seguidores = await _interacaoRepository.CountAsync(
                TipoInteracaoEnum.Seguimento,
                TipoAlvoInteracaoEnum.Usuario,
                usuario.Id
            );
            return usuario;
        }
        public async Task<StatusEnum> ObterStatusUsuario(ValidarUsuarioGoogleInput obterStatusInput)
        {
            var userGoogle = await _authService.ValidarTokenGoogle(obterStatusInput.TokenGoogle);
            var usuarioStatus = await _usuarioRepository.ObterStatusUsuario(userGoogle.Email);
            return usuarioStatus;
        }
        public async Task AtualizarPerfilUsuario(AtualizarPerfilUsuarioInput atualizarPerfilUsuarioInput)
        {
            var userGoogle = await _authService.ValidarTokenGoogle(atualizarPerfilUsuarioInput.TokenGoogle);
            var usuario = await _usuarioRepository.ObterUsuarioPorEmail(userGoogle.Email);

            var novoNomePerfil = atualizarPerfilUsuarioInput.NomePerfil?.Trim();
            var novaBio = atualizarPerfilUsuarioInput.Bio?.Trim();
            var novoEstilo = atualizarPerfilUsuarioInput.EstiloDescricao?.Trim();

            if (!string.IsNullOrWhiteSpace(novoNomePerfil) &&
            !novoNomePerfil.Equals(usuario.NomePerfil, StringComparison.OrdinalIgnoreCase))
            {
                var nomeJaExiste = await _usuarioRepository.VerificaUsuarioExistePorNomePerfil(novoNomePerfil);
                if (nomeJaExiste)
                    throw new ExcecaoPersonalizada(
                        ConstantesCodigoRetornoPadrao.DuplicidadeEncontrada,
                        "Já existe um usuário com este nome de perfil.",
                        () => Log.Error("Nome de perfil já em uso: {NomePerfil}", novoNomePerfil),
                        (int)HttpStatusCode.Conflict
                    );
            }

            if (novaBio != null)
                usuario.Bio = novaBio;

            if (novoEstilo != null)
                usuario.EstiloDescricao = novoEstilo;

            usuario.DataAtualizacao = DateTime.UtcNow;

            await _usuarioRepository.AtualizarPerfilUsuario(usuario);
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

            if (atualizarFotoUsuarioInput.fotoPerfilEnum == TipoFotoPerfilEnum.FotoPerfil)
            {
                var pathBucket = $"usuarios/{usuario.NomePerfil}/foto_perfil.webp";
                var pathCompleto = await _bucketService.UploadAsync(atualizarFotoUsuarioInput.FotoPerfil, pathBucket);

                await _usuarioRepository.AtualizarFotoPerfil(usuario.Id, pathCompleto, atualizarFotoUsuarioInput.fotoPerfilEnum);
                return pathCompleto;
            }
            else
            {
                var pathBucket = $"usuarios/{usuario.NomePerfil}/foto_capa.webp";
                var pathCompleto = await _bucketService.UploadAsync(atualizarFotoUsuarioInput.FotoPerfil, pathBucket);
                await _usuarioRepository.AtualizarFotoPerfil(usuario.Id, pathCompleto, atualizarFotoUsuarioInput.fotoPerfilEnum);
                return pathCompleto;
            }
        }
        public async Task CadastrarArtista(CadastrarArtistaInput cadastrarArtistaInput)
        {
            var usuario = await _usuarioRepository.ObterUsuarioPorId(cadastrarArtistaInput.UsuarioId);
            var artista = new Artista
            {
                UsuarioId = usuario.Id,
            };
            await _usuarioRepository.CadastrarArtista(artista, usuario.Id);
        }

        public async Task<Artista> ObterPerfilArtista(ValidarUsuarioGoogleInput obterArtistaInput)
        {
            var userGoogle = await _authService.ValidarTokenGoogle(obterArtistaInput.TokenGoogle);
            var usuario = await _usuarioRepository.ObterUsuarioPorEmail(userGoogle.Email);

            var artista = await _usuarioRepository.ObterArtistaPorUsuarioId(usuario.Id);
            if (artista.PortfolioItens != null)
            {
                foreach (var item in artista.PortfolioItens)
                {
                    for(int j = 0; j < item.Imagens.Count; j++)
                    {
                        var imagem = item.Imagens.ElementAt(j);
                        var signedUrl = _bucketService.GetPresignedUrl(imagem.UrlArquivo, TimeSpan.FromHours(6));
                        if (!string.IsNullOrWhiteSpace(signedUrl))
                            imagem.UrlArquivo = signedUrl;
                    }

                    item.QuantidadeCurtidas = await _interacaoRepository.CountAsync(
                        TipoInteracaoEnum.Curtida,
                        TipoAlvoInteracaoEnum.PortfolioItem,
                        item.Id
                    );
                    item.QuantidadeSalvos = await _interacaoRepository.CountAsync(
                        TipoInteracaoEnum.Salvamento,
                        TipoAlvoInteracaoEnum.PortfolioItem,
                        item.Id
                    );
                }
            }
            return artista;
        }
        public async Task CadastrarPortfolioAsync(CadastrarPortfolioInput cadastrarPortfolioInput)
        {
            var artista = await ObterPerfilArtista(cadastrarPortfolioInput.TokenGoogle);
            var usuario = await _usuarioRepository.ObterUsuarioPorId(artista.UsuarioId);

            var imagens = cadastrarPortfolioInput.Imagens?
                .Where(i => i != null && i.Length > 0)
                .ToList();

            if (imagens == null || imagens.Count == 0)
                throw new ArgumentException("Nenhuma imagem enviada.");

            // validação de tipo
            foreach (var imagem in imagens)
            {
                if (!imagem.ContentType.StartsWith("image/"))
                    throw new ExcecaoPersonalizada(
                        ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                        "Tipo de dado inválido, insira uma imagem/gif",
                        () => Log.Error($"Tipo inválido para portfolio do artista {usuario.NomePerfil}"),
                        (int)HttpStatusCode.BadRequest);
            }

            var portfolioItem = new PortfolioItem
            {
                Titulo = cadastrarPortfolioInput.Titulo ?? string.Empty,
                Descricao = cadastrarPortfolioInput.Descricao ?? string.Empty,
                ArtistaId = artista.Id,
                Hashtags = cadastrarPortfolioInput.Hashtags ?? new List<string>(),
                //TipoServico = TipoServicoEnum.,
                DataCriacao = DateTime.UtcNow,
                Imagens = new List<PortfolioItemImagem>()
            };

            var loteId = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            for (int i = 0; i < imagens.Count; i++)
            {
                var imagem = imagens[i];

                var sufixo = $"{loteId}-{(i + 1).ToString("D2")}";
                var pathBucket = $"portfolios/usuarios/{usuario.NomePerfil}/{sufixo}.webp";

                var url = await _bucketService.UploadAsync(imagem, pathBucket);

                portfolioItem.Imagens.Add(new PortfolioItemImagem
                {
                    UrlArquivo = url,
                    Ordem = i
                });
            }

            await _usuarioRepository.CadastrarPortfolioArtista(artista.Id, portfolioItem);
        }
        public async Task AtualizarRedesSociais(AtualizarRedesSociaisInput atualizarRedesSociaisInput)
        {
            var userGoogle = await _authService.ValidarTokenGoogle(atualizarRedesSociaisInput.TokenGoogle);
            var usuario = await _usuarioRepository.ObterUsuarioPorEmail(userGoogle.Email);

            var redeSocial = new RedeSocial
            {
                Titulo = atualizarRedesSociaisInput.RedeSocial,
                Url = atualizarRedesSociaisInput.Usuario,
                UsuarioId = usuario.Id
            };
            await _usuarioRepository.AtualizarRedesSociais(redeSocial);
        }
        //public async Task CriarServico(criarservico)
        //{

        //}
    }
}
