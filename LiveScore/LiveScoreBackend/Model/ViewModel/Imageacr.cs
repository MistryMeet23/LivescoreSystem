using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LiveScore.Model.ViewModel
{
    public class Imageacr
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Contact { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        //[Column(TypeName = "datetime")]
        //public DateTime LastLogin { get; set; }
        public string Gender { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public IFormFile ImageFile { get; set; }

    }
}
