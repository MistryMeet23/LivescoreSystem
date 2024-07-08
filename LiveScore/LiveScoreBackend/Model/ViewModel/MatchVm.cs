using System.ComponentModel.DataAnnotations;

namespace LiveScore.Model.ViewModel
{
    public class MatchVm
    {
        public string? MatchStatus { get; set; }
        public string MatchType { get; set; }
        //public int NumberOfRound { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MatchDate { get; set; }
        public int? AthleteRed { get; set; }
        public int? AthleteBlue { get; set; }
        public string? Gender { get; set; }
        public int? NextMatchId { get; set; }
        public int MatchGroup { get; set; }
        public int? Flag { get; set; }
        public int? CategoryId { get; set; }
        public int? TournamentId { get; set; }
    }
}
