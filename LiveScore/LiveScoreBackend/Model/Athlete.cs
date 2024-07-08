using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using LiveScore.Model;

namespace LiveScoring.Model
{
    public class Athlete
    {
        public int Id { get; set; }
        public string? AthleteName { get; set; }
        public string? Email { get; set; }

        public string Contact { get; set; }
        public string ImageUrl { get; set; }

        //[NotMapped]
        //public IFormFile? ImageFile { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }
        [NotMapped]
       public int Age
        {
            get
            {
                // Calculate age based on current date and DateOfBirth
                int age = DateTime.Now.Year - DateOfBirth.Year;

                // If the athlete hasn't had their birthday yet this year, subtract one year from age
                if (DateTime.Now.Month < DateOfBirth.Month || (DateTime.Now.Month == DateOfBirth.Month && DateTime.Now.Day < DateOfBirth.Day))
                {
                    age--;
                }

                return age;
            }
            set { }            
        }
        public string Gender { get; set; }

        [Range(1, 10, ErrorMessage = "Height must be greater than 0")]
        public double Height { get; set; }
        [Range(1, 100, ErrorMessage = "Height must be greater than 0")]
        public double? Weight { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Status { get; set; } = "UnBlock";
        public int CategoryId { get; set; }

        [JsonIgnore]
        public virtual Category? Category { get; set; }

        public int CoachId { get; set; }
        [JsonIgnore]
        public virtual Coach? Coach { get; set; }   
        public int Coordinater { get; set; }

        [JsonIgnore]
        public virtual ACR? acr { get; set; }

    }
}
