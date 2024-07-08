using LiveScoring.Model;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LiveScore.Model.ViewModel
{
    public class RoundVm
    {
        public int? Rounds { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? RoundTime { get; set; }
        public int? MatchId { get; set; }

    }
}
