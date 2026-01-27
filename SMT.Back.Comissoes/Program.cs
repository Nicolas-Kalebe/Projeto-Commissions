using Microsoft.EntityFrameworkCore;
using SMT.Back.Comissoes.Data;
using Serilog;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Services;
using SMT.Back.Comissoes.Repositories.Interfaces;
using SMT.Back.Comissoes.Repositories;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();


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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
//app.UseAuthorization();

app.UseCors("DevCors");

app.MapControllers();

app.Run();
