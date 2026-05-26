using Serilog;
using SMT.Back.Comissoes.DTO.Input.Usuario;
using SMT.Back.Comissoes.DTO.Input.UsuarioController;
using SMT.Back.Comissoes.DTO.Output.Usuario;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;
using SMT.Back.Comissoes.Repositories.Interfaces;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.Net;

namespace SMT.Back.Comissoes.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IBucketService _bucketService;
        private readonly IInteracaoRepository _interacaoRepository;
        private readonly ICurrentUser _currentUser;

        public UsuarioService(
            IUsuarioRepository usuarioRepository,
            IBucketService bucketService,
            IInteracaoRepository interacaoRepository,
            ICurrentUser currentUser)
        {
            _usuarioRepository = usuarioRepository;
            _bucketService = bucketService;
            _interacaoRepository = interacaoRepository;
            _currentUser = currentUser;
        }

        public async Task<StatusEnum> ObterStatusUsuario()
        {
            var usuario = await _usuarioRepository.ObterUsuarioPorId(_currentUser.UsuarioId);
            return usuario.Status;
        }

        public async Task<ObterUsuarioOutput> ObterMeuUsuario()
        {
            var usuario = await _usuarioRepository.ObterUsuarioPorEmail(_currentUser.Email);

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

            return new ObterUsuarioOutput
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                NomePerfil = usuario.NomePerfil,
                JaAnunciou = usuario.JaAnunciou,
                DataNascimento = usuario.DataNascimento,
                Email = usuario.Email,
                Celular = usuario.Celular,
                FotoPerfil = usuario.FotoPerfil,
                FotoCapa = usuario.FotoCapa,
                Bio = usuario.Bio,
                DataCriacao = usuario.DataCriacao,
                DataAtualizacao = usuario.DataAtualizacao,
                Status = usuario.Status,
                Seguidores = usuario.Seguidores,
                Pronome = usuario.Pronome?.obterDescricaoEnum(),
                RedesSociais = usuario.RedesSociais
            };
        }

        public async Task<AtualizarPerfilUsuarioOutput> AtualizarPerfilUsuario(AtualizarPerfilUsuarioInput input)
        {
            var usuario = await _usuarioRepository.ObterUsuarioPorId(_currentUser.UsuarioId);

            if (input.NomePerfil is not null && string.IsNullOrWhiteSpace(input.NomePerfil))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DadoNulo,
                    "Nome de perfil não pode ser vazio.",
                    () => Log.Error($"Nome de perfil vazio para userId {usuario.Id}."),
                    (int)HttpStatusCode.BadRequest);

            if (input.Bio is not null && string.IsNullOrWhiteSpace(input.Bio))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DadoNulo,
                    "Biografia não pode ser vazia.",
                    () => Log.Error($"Bio vazia para userId {usuario.Id}."),
                    (int)HttpStatusCode.BadRequest);

            var novoNomePerfil = input.NomePerfil?.Trim();
            var novaBio = input.Bio?.Trim();

            if (!string.IsNullOrWhiteSpace(novoNomePerfil) &&
                !novoNomePerfil.Equals(usuario.NomePerfil, StringComparison.OrdinalIgnoreCase))
            {
                var nomeJaExiste = await _usuarioRepository.VerificaUsuarioExistePorNomePerfil(novoNomePerfil);
                if (nomeJaExiste)
                    throw new ExcecaoPersonalizada(
                        ConstantesCodigoRetornoPadrao.DuplicidadeEncontrada,
                        "Já existe um usuário com este nome de perfil.",
                        () => Log.Warning($"NomePerfil duplicado: {novoNomePerfil}."),
                        (int)HttpStatusCode.Conflict);
            }

            var output = new AtualizarPerfilUsuarioOutput();

            if (novoNomePerfil != null && !novoNomePerfil.Equals(usuario.NomePerfil, StringComparison.OrdinalIgnoreCase))
            {
                usuario.NomePerfil = novoNomePerfil;
                output.NomePerfil = usuario.NomePerfil;
            }

            if (novaBio != null && novaBio != usuario.Bio)
            {
                usuario.Bio = novaBio;
                output.Bio = usuario.Bio;
            }

            if (input.Pronome.HasValue && input.Pronome.Value != usuario.Pronome)
            {
                usuario.Pronome = input.Pronome.Value;
                output.Pronome = usuario.Pronome?.obterDescricaoEnum();
            }

            usuario.DataAtualizacao = DateTime.UtcNow;
            await _usuarioRepository.AtualizarPerfilUsuario(usuario);
            return output;
        }

        public async Task<string> AtualizarFotoUsuario(AtualizarFotoUsuarioInput input)
        {
            var usuario = await _usuarioRepository.ObterUsuarioPorId(_currentUser.UsuarioId);

            if (input.FotoPerfil == null || input.FotoPerfil.Length == 0)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DadoNulo,
                    "Nenhuma imagem enviada.",
                    () => Log.Warning($"AtualizarFotoUsuario sem arquivo para userId {usuario.Id}."),
                    (int)HttpStatusCode.BadRequest);

            if (!input.FotoPerfil.ContentType.StartsWith("image/"))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Tipo de dado inválido, insira uma imagem/gif.",
                    () => Log.Warning($"AtualizarFotoUsuario tipo inválido para userId {usuario.Id} contentType {input.FotoPerfil.ContentType}."),
                    (int)HttpStatusCode.BadRequest);

            var nomeArquivo = input.fotoPerfilEnum == TipoFotoPerfilEnum.FotoPerfil ? "foto_perfil.webp" : "foto_capa.webp";
            var pathBucket = $"usuarios/{usuario.NomePerfil}/{nomeArquivo}";
            var pathCompleto = await _bucketService.UploadAsync(input.FotoPerfil, pathBucket);
            await _usuarioRepository.AtualizarFotoPerfil(usuario.Id, pathCompleto, input.fotoPerfilEnum);
            return pathCompleto;
        }

        public async Task AtualizarRedesSociais(AtualizarRedesSociaisInput input)
        {
            var redeSocial = new RedeSocial
            {
                Titulo = input.RedeSocial,
                Url = input.Usuario,
                UsuarioId = _currentUser.UsuarioId
            };
            await _usuarioRepository.AtualizarRedesSociais(redeSocial);
        }

        public async Task CadastrarArtista(CadastrarArtistaInput input)
        {
            var usuario = await _usuarioRepository.ObterUsuarioPorId(_currentUser.UsuarioId);

            if (usuario.JaAnunciou)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.UsuarioJaEhArtista,
                    "Usuário já está cadastrado como artista.",
                    () => Log.Warning($"CadastrarArtista bloqueado: usuario {usuario.Id} ja e artista."),
                    (int)HttpStatusCode.Conflict);

            if (!System.Enum.IsDefined(typeof(CargoArtistaEnum), input.CargoArtista))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Cargo de artista inválido.",
                    () => Log.Warning($"CadastrarArtista cargo invalido {input.CargoArtista} userId {usuario.Id}."),
                    (int)HttpStatusCode.BadRequest);

            var artista = new Artista
            {
                UsuarioId = usuario.Id,
                CargoArtista = input.CargoArtista,
                PrazoMedioEntrega = input.PrazoMedioEntrega,
                TagsArtista = input.TagsArtista
            };
            await _usuarioRepository.CadastrarArtista(artista, usuario.Id);
        }

        public async Task<ObterPerfilArtistaOutput> ObterPerfilArtista()
        {
            var usuario = await _usuarioRepository.ObterUsuarioPorId(_currentUser.UsuarioId);

            if (!usuario.JaAnunciou)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.UsuarioNaoEhArtista,
                    "Usuário ainda não está cadastrado como artista.",
                    () => Log.Warning($"ObterPerfilArtista bloqueado: usuario {usuario.Id} nao e artista."),
                    (int)HttpStatusCode.Forbidden);

            var artista = await _usuarioRepository.ObterArtistaPorUsuarioId(usuario.Id);

            var portfolioItensOutput = new List<PortfolioItemOutput>();
            if (artista.PortfolioItens != null)
            {
                foreach (var item in artista.PortfolioItens)
                {
                    foreach (var imagem in item.Imagens)
                    {
                        var signedUrl = _bucketService.GetPresignedUrl(imagem.UrlArquivo, TimeSpan.FromHours(6));
                        if (!string.IsNullOrWhiteSpace(signedUrl))
                            imagem.UrlArquivo = signedUrl;
                    }

                    item.QuantidadeCurtidas = await _interacaoRepository.CountAsync(
                        TipoInteracaoEnum.Curtida, TipoAlvoInteracaoEnum.PortfolioItem, item.Id);
                    item.QuantidadeSalvos = await _interacaoRepository.CountAsync(
                        TipoInteracaoEnum.Salvamento, TipoAlvoInteracaoEnum.PortfolioItem, item.Id);

                    var curtidoPeloUsuario = await _interacaoRepository.ExistsAsync(i =>
                        i.UsuarioId == usuario.Id && i.AlvoId == item.Id &&
                        i.TipoAlvoInteracao == TipoAlvoInteracaoEnum.PortfolioItem &&
                        i.TipoInteracao == TipoInteracaoEnum.Curtida);

                    var salvoPeloUsuario = await _interacaoRepository.ExistsAsync(i =>
                        i.UsuarioId == usuario.Id && i.AlvoId == item.Id &&
                        i.TipoAlvoInteracao == TipoAlvoInteracaoEnum.PortfolioItem &&
                        i.TipoInteracao == TipoInteracaoEnum.Salvamento);

                    portfolioItensOutput.Add(new PortfolioItemOutput
                    {
                        Id = item.Id,
                        ArtistaId = item.ArtistaId,
                        Titulo = item.Titulo,
                        Descricao = item.Descricao,
                        Hashtags = item.Hashtags,
                        Imagens = item.Imagens,
                        QuantidadeCurtidas = item.QuantidadeCurtidas,
                        QuantidadeSalvos = item.QuantidadeSalvos,
                        QuantidadeVisualizacoes = item.QuantidadeVisualizacoes,
                        DataCriacao = item.DataCriacao,
                        CurtidoPeloUsuario = curtidoPeloUsuario,
                        SalvoPeloUsuario = salvoPeloUsuario
                    });
                }
            }

            return new ObterPerfilArtistaOutput
            {
                Id = artista.Id,
                UsuarioId = artista.UsuarioId,
                Estilo = artista.Estilo,
                CargoArtista = artista.CargoArtista.obterDescricaoEnum() ?? string.Empty,
                PrazoMedioEntrega = artista.PrazoMedioEntrega?.obterDescricaoEnum(),
                TagsArtista = artista.TagsArtista,
                PortfolioItens = portfolioItensOutput,
                Avaliacao = artista.Avaliacao,
                AtivoParaServicos = artista.AtivoParaServicos,
                Servicos = artista.Servicos
            };
        }

        public async Task<AtualizarPerfilArtistaOutput> AtualizarPerfilArtista(AtualizarPerfilArtistaInput input)
        {
            var usuario = await _usuarioRepository.ObterUsuarioPorId(_currentUser.UsuarioId);

            if (!usuario.JaAnunciou)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.UsuarioNaoEhArtista,
                    "Usuário ainda não está cadastrado como artista.",
                    () => Log.Warning($"AtualizarPerfilArtista bloqueado: usuario {usuario.Id} nao e artista."),
                    (int)HttpStatusCode.Forbidden);

            if (input.CargoArtista.HasValue && !System.Enum.IsDefined(typeof(CargoArtistaEnum), input.CargoArtista.Value))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Cargo de artista inválido.",
                    () => Log.Warning($"AtualizarPerfilArtista cargo invalido {input.CargoArtista} userId {usuario.Id}."),
                    (int)HttpStatusCode.BadRequest);

            var artista = await _usuarioRepository.ObterArtistaPorUsuarioId(_currentUser.UsuarioId);

            if (input.CargoArtista.HasValue)
                artista.CargoArtista = input.CargoArtista ?? artista.CargoArtista;

            if (input.PrazoMedioEntrega.HasValue)
                artista.PrazoMedioEntrega = input.PrazoMedioEntrega ?? artista.PrazoMedioEntrega;

            if (input.EstiloDescricao != null)
                artista.Estilo = input.EstiloDescricao;

            if (input.TagsArtista != null)
                artista.TagsArtista = input.TagsArtista;

            await _usuarioRepository.AtualizarPerfilArtista(artista);

            return new AtualizarPerfilArtistaOutput
            {
                CargoArtista = artista.CargoArtista.obterDescricaoEnum(),
                PrazoMedioEntrega = artista.PrazoMedioEntrega?.obterDescricaoEnum(),
                EstiloDescricao = artista.Estilo
            };
        }

        public async Task CadastrarPortfolioAsync(CadastrarPortfolioInput input)
        {
            var usuario = await _usuarioRepository.ObterUsuarioPorId(_currentUser.UsuarioId);

            if (!usuario.JaAnunciou)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.UsuarioNaoEhArtista,
                    "Usuário ainda não está cadastrado como artista.",
                    () => Log.Warning($"CadastrarPortfolio bloqueado: usuario {usuario.Id} nao e artista."),
                    (int)HttpStatusCode.Forbidden);

            var artista = await _usuarioRepository.ObterArtistaPorUsuarioId(usuario.Id);

            var imagens = input.Imagens?
                .Where(i => i != null && i.Length > 0)
                .ToList();

            if (imagens == null || imagens.Count == 0)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DadoNulo,
                    "Nenhuma imagem enviada.",
                    () => Log.Warning($"CadastrarPortfolio sem imagens para userId {usuario.Id}."),
                    (int)HttpStatusCode.BadRequest);

            foreach (var imagem in imagens)
            {
                if (!imagem.ContentType.StartsWith("image/"))
                    throw new ExcecaoPersonalizada(
                        ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                        "Tipo de dado inválido, insira uma imagem/gif.",
                        () => Log.Warning($"CadastrarPortfolio tipo inválido para userId {usuario.Id} contentType {imagem.ContentType}."),
                        (int)HttpStatusCode.BadRequest);
            }

            var portfolioItem = new PortfolioItem
            {
                Titulo = input.Titulo ?? string.Empty,
                Descricao = input.Descricao ?? string.Empty,
                ArtistaId = artista.Id,
                Hashtags = input.Hashtags ?? new List<string>(),
                DataCriacao = DateTime.UtcNow,
                Imagens = new List<PortfolioItemImagem>()
            };

            var loteId = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            for (int i = 0; i < imagens.Count; i++)
            {
                var imagem = imagens[i];
                var sufixo = $"{loteId}-{(i + 1):D2}";
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
    }
}
