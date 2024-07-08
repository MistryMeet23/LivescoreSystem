using LiveScoring.Model;
using System.ComponentModel.DataAnnotations;

namespace LiveScore.Model
{
    public class Images
    {
        public string AthleteName { get; set; }

        public string Email { get; set; }

        public string Contact { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }
       
        public string Gender { get; set; }

        public double Height { get; set; }

        public double? Weight { get; set; }

        public string City { get; set; }

        public string State { get; set; }
        
        public int CategoryId { get; set; }

        public int CoachId { get; set; }

        public int CoordinatorId { get; set; }

        public IFormFile ImageFile { get; set; }
    }
}
