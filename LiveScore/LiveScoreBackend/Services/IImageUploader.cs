namespace LiveScore.Services
{
    public interface IImageUploader
    {
        Task<string> UploadImg(IFormFile file, string foldername);
        void DeleteImage(string imageUrl, string foldername);
    }
}
