using LiveScore.Model;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace LiveScoring.Model
{
    public class Tournament
    {
        public int TId { get; set; }
        public string? TournamentName { get; set; }
        public string? Venue { get; set; }


        [DataType(DataType.Date)]
        public DateTime TournamentDate { get; set; }

        public int? TournamentCoordinator { get; set; }

        [JsonIgnore]
        public virtual ACR? Coordinator { get; set; }

    }
}
