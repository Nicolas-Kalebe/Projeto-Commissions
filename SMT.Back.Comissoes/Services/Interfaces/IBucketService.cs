namespace SMT.Back.Comissoes.Services.Interfaces
{
    public interface IBucketService
    {
        Task<string> UploadAsync(IFormFile file, string path);
        Task DeleteAsync(string path);
        string? GetPresignedUrl(string fileUrlOrKey, TimeSpan expiresIn);
    }
}
