using LiveScore.Data;
using Microsoft.AspNetCore.Hosting;
using Org.BouncyCastle.Asn1.Ocsp;

namespace LiveScore.Services
{
    public class UploadImage : IImageUploader
    {
        //private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public UploadImage(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        

        public async Task<string> UploadImg(IFormFile file, string foldername)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, foldername);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName;
            //return $"{Request.Scheme}://{Request.Host}/coach/{fileName}";
        }
        public  void DeleteImage(string imageUrl, string foldername)
        {
            var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, foldername, Path.GetFileName(imageUrl));
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }

    }
}
