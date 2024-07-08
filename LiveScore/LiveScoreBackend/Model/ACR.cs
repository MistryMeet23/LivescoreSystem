using LiveScoring.Model;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LiveScore.Model
{
    public class ACR
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public string? Password { get; set; }

        public string ImageURL { get; set; }
        public string Contact { get; set; }

        public string Status { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }
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

        [Column(TypeName="datetime")]
        public DateTime? LastLogin { get; set; }
        public string? Gender { get; set; }
        public string? City { get; set; }
        public string State { get; set; }
        public int? RoleId { get; set; }

        [JsonIgnore]
        public virtual Role? Role { get; set; }
    }
}
