using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using SMT.Back.Comissoes.Services.Interfaces;
using static System.Net.WebRequestMethods;

public class BucketService : IBucketService
{
    private readonly IAmazonS3 _s3;
    private readonly string _bucketName;
    private readonly string _baseUrl;

    public BucketService(IAmazonS3 s3)
    {
        _s3 = s3;
        _bucketName = "usuario-portfolio";
        _baseUrl = "https://f005.backblazeb2.com/file/usuario-portfolio";
    }

    public async Task<string> UploadAsync(IFormFile file, string path)
    {
        using var stream = file.OpenReadStream();
        path = $"{path}-{Guid.NewGuid():N}";

        var request = new PutObjectRequest
        {
            BucketName = _bucketName, // bucket no B2
            Key = path,               // "pastas"/nome do arquivo
            InputStream = stream,     // conteúdo do arquivo
            ContentType = file.ContentType,
        };

        await _s3.PutObjectAsync(request);

        return $"{_baseUrl}/{path}";
    }

    public async Task DeleteAsync(string path)
    {
        await _s3.DeleteObjectAsync(_bucketName, path);
    }

    public string? GetPresignedUrl(string fileUrlOrKey, TimeSpan expiresIn)
    {
        var key = NormalizeKey(fileUrlOrKey);
        if (string.IsNullOrWhiteSpace(key))
            return null;

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = key,
            Expires = DateTime.UtcNow.Add(expiresIn),
            Protocol = Protocol.HTTPS,
            Verb = HttpVerb.GET,
        };

        return _s3.GetPreSignedURL(request);
    }

    private string? NormalizeKey(string fileUrlOrKey)
    {
        if (string.IsNullOrWhiteSpace(fileUrlOrKey))
            return null;

        var trimmed = fileUrlOrKey.Trim();
        if (!trimmed.Contains("://"))
        {
            return trimmed.TrimStart('/');
        }

        if (!Uri.TryCreate(trimmed, UriKind.Absolute, out var uri))
            return null;

        var path = uri.AbsolutePath.TrimStart('/');

        if (path.StartsWith("file/", StringComparison.OrdinalIgnoreCase))
        {
            var withoutFile = path.Substring("file/".Length);
            if (withoutFile.StartsWith($"{_bucketName}/", StringComparison.OrdinalIgnoreCase))
                return withoutFile.Substring($"{_bucketName}/".Length);
        }

        if (path.StartsWith($"{_bucketName}/", StringComparison.OrdinalIgnoreCase))
            return path.Substring($"{_bucketName}/".Length);

        var basePrefix = $"{_baseUrl.TrimEnd('/')}/";
        if (trimmed.StartsWith(basePrefix, StringComparison.OrdinalIgnoreCase))
            return trimmed.Substring(basePrefix.Length);

        return null;
    }
}
