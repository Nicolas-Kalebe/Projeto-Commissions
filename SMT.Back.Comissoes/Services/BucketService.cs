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
}
