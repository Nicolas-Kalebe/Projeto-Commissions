using Serilog;
using SMT.Back.Comissoes.Services.Interfaces;
using SMT.Back.Comissoes.Utils;
using System.Net;
using System.Text;
using System.Text.Json;

namespace SMT.Back.Comissoes.Services
{
    public class BrevoEmailService : IEmailService
    {
        private readonly HttpClient _http;
        private readonly string _senderEmail;
        private readonly string _senderName;

        public BrevoEmailService(HttpClient http, IConfiguration configuration)
        {
            _http = http;
            _senderEmail = configuration["Brevo:SenderEmail"]
                ?? throw new InvalidOperationException("Brevo:SenderEmail nao configurado.");
            _senderName = configuration["Brevo:SenderName"]
                ?? throw new InvalidOperationException("Brevo:SenderName nao configurado.");
        }

        public async Task EnviarCodigoVerificacao(string emailDestino, string nome, string codigo)
        {
            var nomeExibicao = string.IsNullOrWhiteSpace(nome) ? emailDestino : nome;
            var htmlContent = MontarHtml(nomeExibicao, codigo);

            var payload = new
            {
                sender = new { name = _senderName, email = _senderEmail },
                to = new[] { new { email = emailDestino, name = nomeExibicao } },
                subject = "Seu código de verificação - Projeto Commissions",
                htmlContent
            };

            var json = JsonSerializer.Serialize(payload);
            using var content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response;
            try
            {
                response = await _http.PostAsync("smtp/email", content);
            }
            catch (Exception ex)
            {
                Log.Error(ex, $"Falha de rede ao enviar email via Brevo para {emailDestino}.");
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.ErroInternoServidor,
                    "Falha ao enviar e-mail de verificação.",
                    () => Log.Error($"Falha de rede Brevo: {emailDestino}."),
                    (int)HttpStatusCode.BadGateway);
            }

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                Log.Error($"Brevo retornou {response.StatusCode} para {emailDestino}: {body}.");
                throw new ExcecaoPersonalizada(
                    ConstantesCodigoRetornoPadrao.ErroInternoServidor,
                    "Falha ao enviar e-mail de verificação.",
                    () => Log.Error($"Brevo falhou: {emailDestino} status {response.StatusCode}."),
                    (int)HttpStatusCode.BadGateway);
            }

            Log.Information($"Codigo de verificacao enviado via Brevo para {emailDestino}.");
        }

        private static string MontarHtml(string nome, string codigo)
        {
            return $@"
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family: Arial, sans-serif; background-color:#f4f4f4; padding:24px;'>
  <div style='max-width:520px; margin:auto; background-color:#ffffff; padding:32px; border-radius:8px;'>
    <h2 style='color:#222; margin-bottom:16px;'>Olá, {WebUtility.HtmlEncode(nome)}!</h2>
    <p style='color:#444; line-height:1.5;'>
      Use o código abaixo para confirmar seu e-mail no <strong>Projeto Commissions</strong>:
    </p>
    <div style='font-size:32px; font-weight:bold; letter-spacing:8px; text-align:center; padding:16px; background-color:#f0f0f0; border-radius:8px; color:#111; margin:24px 0;'>
      {codigo}
    </div>
    <p style='color:#666; font-size:14px;'>
      O código expira em <strong>10 minutos</strong>. Se você não solicitou este código, ignore este e-mail.
    </p>
  </div>
</body>
</html>";
        }
    }
}
