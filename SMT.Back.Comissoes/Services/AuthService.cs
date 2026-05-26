using Google.Apis.Auth;
using Serilog;
using SMT.Back.Comissoes.DTO.Input.Auth;
using SMT.Back.Comissoes.DTO.Output.Auth;
using SMT.Back.Comissoes.Models.Entity;
using SMT.Back.Comissoes.Models.Enum;
using SMT.Back.Comissoes.Repositories.Interfaces;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.Net;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace SMT.Back.Comissoes.Services
{
    public class AuthService : IAuthService
    {
        private readonly string _googleClientId;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IAuthRepository _authRepository;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;

        private const int CodigoValidadeMinutos = 10;
        private const int MaxTentativasCodigo = 5;
        private const int CooldownReenvioSegundos = 60;

        public AuthService(
            IConfiguration configuration,
            IUsuarioRepository usuarioRepository,
            IAuthRepository authRepository,
            IJwtService jwtService,
            IEmailService emailService)
        {
            _googleClientId = configuration["GoogleAuth:ClientId"]
                ?? throw new InvalidOperationException("GoogleAuth:ClientId nao configurado.");
            _usuarioRepository = usuarioRepository;
            _authRepository = authRepository;
            _jwtService = jwtService;
            _emailService = emailService;
        }

        public async Task<GoogleJsonWebSignature.Payload> ValidarTokenGoogle(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DadoNulo,
                    "Token Google inválido ou nulo.",
                    () => Log.Error("Token Google inválido ou nulo."),
                    (int)HttpStatusCode.BadRequest);
            }
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _googleClientId }
            };
            return await GoogleJsonWebSignature.ValidateAsync(token, settings);
        }

        public async Task Cadastrar(CadastrarLocalInput input)
        {
            if (input == null)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DadoNulo,
                    "Dados do cadastro não podem ser nulos.",
                    () => Log.Warning("Cadastro com dados nulos"),
                    (int)HttpStatusCode.BadRequest);

            ValidarSenha(input.Senha);

            var emailNormalizado = input.Email.Trim().ToLowerInvariant();
            var nomePerfil = input.NomePerfil.Trim();

            var usuarioExistente = await _usuarioRepository.BuscarUsuarioPorEmail(emailNormalizado);
            if (usuarioExistente != null)
            {
                if (usuarioExistente.ProvedorAutenticacao == ProvedorAutenticacaoEnum.Google)
                {
                    throw new ExcecaoPersonalizada(
                        ConstantesCodigoRetornoPadrao.ProvedorIncompativel,
                        "Esse e-mail já foi cadastrado via Google. Use o login do Google.",
                        () => Log.Warning($"Cadastro local bloqueado, email ja Google: {emailNormalizado}."),
                        (int)HttpStatusCode.Conflict);
                }
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DuplicidadeEncontrada,
                    "Já existe um usuário cadastrado com este e-mail.",
                    () => Log.Warning($"Cadastro com email duplicado: {emailNormalizado}."),
                    (int)HttpStatusCode.Conflict);
            }

            var nomePerfilExistente = await _usuarioRepository.VerificaUsuarioExistePorNomePerfil(nomePerfil);
            if (nomePerfilExistente)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.DuplicidadeEncontrada,
                    "Já existe um usuário cadastrado com este nome de perfil.",
                    () => Log.Warning($"Cadastro com nomePerfil duplicado: {nomePerfil}."),
                    (int)HttpStatusCode.Conflict);

            var usuario = new Usuario
            {
                Nome = nomePerfil,
                NomePerfil = nomePerfil,
                Email = emailNormalizado,
                DataNascimento = input.DataNascimento,
                Pronome = input.Pronome,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(input.Senha, workFactor: 11),
                EmailConfirmado = false,
                ProvedorAutenticacao = ProvedorAutenticacaoEnum.Local,
                Status = StatusEnum.Ativo,
                DataCriacao = DateTime.UtcNow,
                JaAnunciou = false
            };

            await _usuarioRepository.CadastrarUsuario(usuario);
            await GerarEEnviarCodigo(emailNormalizado, usuario.Nome);
        }

        public async Task<AuthOutput> ConfirmarEmail(ConfirmarEmailInput input)
        {
            var emailNormalizado = input.Email.Trim().ToLowerInvariant();
            var codigoStr = input.Codigo.Trim();

            var usuario = await _usuarioRepository.BuscarUsuarioPorEmail(emailNormalizado);
            if (usuario == null || usuario.ProvedorAutenticacao != ProvedorAutenticacaoEnum.Local)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.CodigoInvalidoOuExpirado,
                    "Código inválido ou expirado.",
                    () => Log.Warning($"ConfirmarEmail: usuario nao encontrado/ provedor errado: {emailNormalizado}."),
                    (int)HttpStatusCode.BadRequest);

            var codigo = await _authRepository.ObterCodigoAtivoPorEmail(emailNormalizado);
            if (codigo == null)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.CodigoInvalidoOuExpirado,
                    "Código inválido ou expirado.",
                    () => Log.Warning($"ConfirmarEmail: sem codigo ativo: {emailNormalizado}."),
                    (int)HttpStatusCode.BadRequest);

            if (codigo.Tentativas >= MaxTentativasCodigo)
            {
                codigo.Consumido = true;
                await _authRepository.AtualizarCodigo(codigo);
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.LimiteTentativasAtingido,
                    "Limite de tentativas atingido. Solicite um novo código.",
                    () => Log.Warning($"Codigo invalidado por tentativas: {emailNormalizado}."),
                    (int)HttpStatusCode.BadRequest);
            }

            if (!BCrypt.Net.BCrypt.Verify(codigoStr, codigo.CodigoHash))
            {
                codigo.Tentativas += 1;
                await _authRepository.AtualizarCodigo(codigo);
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.CodigoInvalidoOuExpirado,
                    "Código inválido ou expirado.",
                    () => Log.Warning($"Codigo errado: {emailNormalizado} tentativa {codigo.Tentativas}."),
                    (int)HttpStatusCode.BadRequest);
            }

            codigo.Consumido = true;
            await _authRepository.AtualizarCodigo(codigo);

            usuario.EmailConfirmado = true;
            usuario.DataAtualizacao = DateTime.UtcNow;
            await _usuarioRepository.AtualizarPerfilUsuario(usuario);

            return await EmitirAuthOutput(usuario);
        }

        public async Task ReenviarCodigo(ReenviarCodigoInput input)
        {
            var emailNormalizado = input.Email.Trim().ToLowerInvariant();
            var usuario = await _usuarioRepository.BuscarUsuarioPorEmail(emailNormalizado);

            // Mensagem generica: nao revela se email existe
            if (usuario == null || usuario.ProvedorAutenticacao != ProvedorAutenticacaoEnum.Local || usuario.EmailConfirmado)
            {
                Log.Information($"ReenviarCodigo ignorado para {emailNormalizado} (nao aplicavel).");
                return;
            }

            var ultimo = await _authRepository.ObterUltimoCodigoPorEmail(emailNormalizado);
            if (ultimo != null && (DateTime.UtcNow - ultimo.DataCriacao).TotalSeconds < CooldownReenvioSegundos)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.CooldownReenvio,
                    "Aguarde alguns segundos antes de solicitar outro código.",
                    () => Log.Information($"ReenviarCodigo cooldown: {emailNormalizado}."),
                    (int)HttpStatusCode.TooManyRequests);
            }

            await _authRepository.InvalidarCodigosAtivos(emailNormalizado);
            await GerarEEnviarCodigo(emailNormalizado, usuario.Nome);
        }

        public async Task<AuthOutput> LoginLocal(LoginLocalInput input)
        {
            var emailNormalizado = input.Email.Trim().ToLowerInvariant();
            var usuario = await _usuarioRepository.BuscarUsuarioPorEmail(emailNormalizado);

            if (usuario == null || usuario.ProvedorAutenticacao != ProvedorAutenticacaoEnum.Local
                || string.IsNullOrEmpty(usuario.SenhaHash)
                || !BCrypt.Net.BCrypt.Verify(input.Senha, usuario.SenhaHash))
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.CredenciaisInvalidas,
                    "Credenciais inválidas.",
                    () => Log.Warning($"LoginLocal falhou: {emailNormalizado}."),
                    (int)HttpStatusCode.Unauthorized);
            }

            if (!usuario.EmailConfirmado)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.EmailNaoConfirmado,
                    "E-mail ainda não confirmado. Verifique sua caixa de entrada.",
                    () => Log.Information($"LoginLocal bloqueado por email nao confirmado: {emailNormalizado}."),
                    (int)HttpStatusCode.Forbidden);
            }

            return await EmitirAuthOutput(usuario);
        }

        public async Task<AuthOutput> LoginGoogle(string tokenGoogle)
        {
            var payload = await ValidarTokenGoogle(tokenGoogle);
            var emailNormalizado = payload.Email.Trim().ToLowerInvariant();

            var usuario = await _usuarioRepository.BuscarUsuarioPorEmail(emailNormalizado);

            if (usuario != null && usuario.ProvedorAutenticacao == ProvedorAutenticacaoEnum.Local)
            {
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.ProvedorIncompativel,
                    "Esse e-mail já foi cadastrado com senha local. Use o login local.",
                    () => Log.Warning($"LoginGoogle bloqueado, email ja Local: {emailNormalizado}."),
                    (int)HttpStatusCode.Conflict);
            }

            if (usuario == null)
            {
                usuario = new Usuario
                {
                    Nome = payload.Name ?? emailNormalizado,
                    NomePerfil = await GerarNomePerfilUnico(payload),
                    Email = emailNormalizado,
                    FotoPerfil = payload.Picture,
                    DataNascimento = DateOnly.FromDateTime(DateTime.UtcNow),
                    EmailConfirmado = true,
                    ProvedorAutenticacao = ProvedorAutenticacaoEnum.Google,
                    Status = StatusEnum.Ativo,
                    DataCriacao = DateTime.UtcNow,
                    JaAnunciou = false
                };
                await _usuarioRepository.CadastrarUsuario(usuario);
            }

            return await EmitirAuthOutput(usuario);
        }

        public async Task<AuthOutput> RefreshToken(RefreshTokenInput input)
        {
            var principal = _jwtService.ValidarTokenSemExpiracao(input.TokenAntigo);
            if (principal == null)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TokenInvalido,
                    "Token inválido.",
                    () => Log.Warning("Refresh com token JWT invalido"),
                    (int)HttpStatusCode.Unauthorized);

            var subClaim = principal.FindFirst("sub")?.Value
                ?? principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(subClaim, out var usuarioIdJwt))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TokenInvalido,
                    "Token inválido.",
                    () => Log.Warning("Refresh sem claim sub valido"),
                    (int)HttpStatusCode.Unauthorized);

            var hash = _jwtService.HashRefreshToken(input.RefreshTokenAntigo);
            var stored = await _authRepository.ObterRefreshTokenPorHash(hash);

            if (stored == null || stored.Revogado || stored.ExpiraEm <= DateTime.UtcNow || stored.UsuarioId != usuarioIdJwt)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TokenInvalido,
                    "Refresh token inválido ou expirado.",
                    () => Log.Warning($"Refresh invalido: hash={hash} sub={usuarioIdJwt}."),
                    (int)HttpStatusCode.Unauthorized);

            var usuario = await _usuarioRepository.ObterUsuarioPorId(usuarioIdJwt);
            var par = _jwtService.GerarTokens(usuario);

            var novoRefresh = new RefreshToken
            {
                UsuarioId = usuario.Id,
                TokenHash = _jwtService.HashRefreshToken(par.RefreshToken),
                ExpiraEm = DateTime.UtcNow.AddDays(_jwtService.RefreshTokenDays),
                DataCriacao = DateTime.UtcNow
            };
            await _authRepository.CriarRefreshToken(novoRefresh);

            stored.Revogado = true;
            stored.SubstituidoPor = novoRefresh.Id;
            await _authRepository.AtualizarRefreshToken(stored);

            return MontarAuthOutput(usuario, par);
        }

        public async Task Logout(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken)) return;
            var hash = _jwtService.HashRefreshToken(refreshToken);
            var stored = await _authRepository.ObterRefreshTokenPorHash(hash);
            if (stored == null || stored.Revogado) return;
            stored.Revogado = true;
            await _authRepository.AtualizarRefreshToken(stored);
        }

        private async Task<AuthOutput> EmitirAuthOutput(Usuario usuario)
        {
            var par = _jwtService.GerarTokens(usuario);
            await _authRepository.CriarRefreshToken(new RefreshToken
            {
                UsuarioId = usuario.Id,
                TokenHash = _jwtService.HashRefreshToken(par.RefreshToken),
                ExpiraEm = DateTime.UtcNow.AddDays(_jwtService.RefreshTokenDays),
                DataCriacao = DateTime.UtcNow
            });
            return MontarAuthOutput(usuario, par);
        }

        private static AuthOutput MontarAuthOutput(Usuario usuario, TokenPar par)
        {
            return new AuthOutput
            {
                AccessToken = par.AccessToken,
                RefreshToken = par.RefreshToken,
                ExpiresIn = par.ExpiresIn,
                Usuario = new AuthUsuarioOutput
                {
                    Id = usuario.Id,
                    Nome = usuario.Nome,
                    NomePerfil = usuario.NomePerfil,
                    Email = usuario.Email,
                    FotoPerfil = usuario.FotoPerfil,
                    JaAnunciou = usuario.JaAnunciou,
                    Provedor = usuario.ProvedorAutenticacao.ToString()
                }
            };
        }

        private async Task GerarEEnviarCodigo(string emailNormalizado, string nome)
        {
            var codigoNumerico = RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
            var codigoHash = BCrypt.Net.BCrypt.HashPassword(codigoNumerico, workFactor: 10);

            await _authRepository.CriarCodigo(new CodigoVerificacaoEmail
            {
                Email = emailNormalizado,
                CodigoHash = codigoHash,
                ExpiraEm = DateTime.UtcNow.AddMinutes(CodigoValidadeMinutos),
                Tentativas = 0,
                Consumido = false,
                DataCriacao = DateTime.UtcNow
            });

            await _emailService.EnviarCodigoVerificacao(emailNormalizado, nome, codigoNumerico);
        }

        private async Task<string> GerarNomePerfilUnico(GoogleJsonWebSignature.Payload payload)
        {
            var baseSlug = (payload.GivenName ?? payload.Name ?? payload.Email.Split('@')[0])
                .ToLowerInvariant();
            baseSlug = Regex.Replace(baseSlug, @"[^a-z0-9]", "");
            if (string.IsNullOrEmpty(baseSlug)) baseSlug = "usuario";

            var candidato = baseSlug;
            var sufixo = 0;
            while (await _usuarioRepository.VerificaUsuarioExistePorNomePerfil(candidato))
            {
                sufixo++;
                candidato = $"{baseSlug}{sufixo}";
            }
            return candidato;
        }

        private static void ValidarSenha(string senha)
        {
            if (string.IsNullOrEmpty(senha) || senha.Length < 8 || senha.Length > 20)
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Senha deve ter entre 8 e 20 caracteres.",
                    () => Log.Warning("Senha com tamanho invalido"),
                    (int)HttpStatusCode.BadRequest);

            if (!Regex.IsMatch(senha, "[A-Z]"))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Senha deve ter pelo menos uma letra maiúscula.",
                    () => Log.Warning("Senha sem maiuscula"),
                    (int)HttpStatusCode.BadRequest);

            if (!Regex.IsMatch(senha, @"[^A-Za-z0-9]"))
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.TipoDeDadoInvalido,
                    "Senha deve ter pelo menos um símbolo.",
                    () => Log.Warning("Senha sem simbolo"),
                    (int)HttpStatusCode.BadRequest);
        }
    }
}
