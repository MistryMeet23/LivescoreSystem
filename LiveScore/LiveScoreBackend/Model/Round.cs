using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace LiveScoring.Model
{
    public class Round
    {
        public int Id { get; set; }
        public int? Rounds { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? RoundTime { get; set; }
        public int? RedTotalScore { get; set; }
        public int? BlueTotalScore { get; set; }
        public int? RoundWinner { get; set; }

        [JsonIgnore]
        public virtual Athlete? Athlete { get; set; }
        public int? MatchId { get; set; }

        [JsonIgnore]
       public virtual Matchs? Match { get; set; }

    }
}
