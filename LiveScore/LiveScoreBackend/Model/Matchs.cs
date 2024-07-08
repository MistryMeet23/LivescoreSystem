using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using LiveScore.Model;

namespace LiveScoring.Model
{
    public class Matchs
    {
        public int MId { get; set; }
        public string? MatchStatus { get; set; }
        public string? MatchType { get; set; }
        //public int? NumberOfRound { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MatchDate { get; set; }
        public string? Gender { get; set; }
        public int? AthleteRed { get; set; }
        public int? AthleteBlue { get; set; }

        public int? NextMatchId { get; set; }       
        public int MatchGroup { get; set; }
        public int? Flag { get; set; }
        public int? CategoryId { get; set; }
        public int? TournamentId  { get; set; }
        [JsonIgnore]
        public virtual Tournament? Tournament { get; set; }

        [JsonIgnore]
        public virtual Category? Category { get; set; }

        [JsonIgnore]
        public virtual Athlete? AthleteRedObj { get; set; }

        [JsonIgnore]
        public virtual Athlete? AthleteBlueObj { get; set; }
        [JsonIgnore]
        public virtual Athlete? Athleteflag { get; set; }

        public int? MatchCoordinator { get; set; }
        public int? Referee1 { get; set; }
        public int? Referee2 { get; set; }
        public int? Referee3 { get; set; }

        [JsonIgnore]
        public virtual ACR? Coordinator { get; set; }
      
        [JsonIgnore]
        public virtual ACR? RefereeF { get; set; }
       
        [JsonIgnore]
        public virtual ACR? RefereeS { get; set; }
       
        [JsonIgnore]
        public virtual ACR? RefereeT { get; set; }

    }
}
