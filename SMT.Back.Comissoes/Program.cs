using Amazon.S3;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Serilog;
using SMT.Back.Comissoes.Data;
using SMT.Back.Comissoes.Repositories;
using SMT.Back.Comissoes.Repositories.Interfaces;
using SMT.Back.Comissoes.Services;
using SMT.Back.Comissoes.Services.Interfaces;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

// JWT config
var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("Jwt:Issuer nao configurado.");
var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("Jwt:Audience nao configurado.");
var jwtSigningKey = builder.Configuration["Jwt:SigningKey"]
    ?? throw new InvalidOperationException("Jwt:SigningKey nao configurado.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSigningKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers(o =>
    {
        var policy = new AuthorizationPolicyBuilder()
            .RequireAuthenticatedUser()
            .Build();
        o.Filters.Add(new AuthorizeFilter(policy));
    })
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SMT.Back.Comissoes", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando Bearer scheme. Exemplo: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("Bearer", doc),
            new List<string>()
        }
    });
});

var allowedOrigins = (builder.Configuration["Cors:AllowedOrigins"] ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AppCors", policy =>
    {
        var origins = allowedOrigins.Length > 0
            ? allowedOrigins
            : new[] { "http://localhost:5173", "https://localhost:5173", "http://127.0.0.1:5173" };
        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddHttpContextAccessor();

// Auth / Email / JWT
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddSingleton<IJwtService, JwtService>();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();
builder.Services.AddHttpClient<IEmailService, BrevoEmailService>((sp, client) =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var baseUrl = config["Brevo:BaseUrl"] ?? "https://api.brevo.com/v3/";
    var apiKey = config["Brevo:ApiKey"]
        ?? throw new InvalidOperationException("Brevo:ApiKey nao configurado.");
    client.BaseAddress = new Uri(baseUrl);
    client.DefaultRequestHeaders.Add("api-key", apiKey);
    client.DefaultRequestHeaders.Add("accept", "application/json");
});

// Usuario / Interacao
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IInteracaoRepository, InteracaoRepository>();
builder.Services.AddScoped<IInteracaoService, InteracaoService>();
builder.Services.AddScoped<IBucketService, BucketService>();
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var serviceUrl = configuration["S3:ServiceUrl"]
        ?? throw new InvalidOperationException("S3:ServiceUrl não configurado.");
    var accessKey = configuration["S3:AccessKey"]
        ?? throw new InvalidOperationException("S3:AccessKey não configurado.");
    var secretKey = configuration["S3:SecretKey"]
        ?? throw new InvalidOperationException("S3:SecretKey não configurado.");

    var config = new AmazonS3Config
    {
        ServiceURL = serviceUrl,
        ForcePathStyle = true
    };

    return new AmazonS3Client(accessKey, secretKey, config);
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("A conexao com o banco de dados nao foi configurada. Defina ConnectionStrings:DefaultConnection.");
}

builder.Services.AddDbContext<DbContextClass>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

try
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<DbContextClass>();
    dbContext.Database.Migrate();
}
catch (Exception ex)
{
    throw new InvalidOperationException("Falha ao aplicar as migracoes do banco de dados.", ex);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AppCors");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
