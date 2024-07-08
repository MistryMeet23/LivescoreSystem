using System.ComponentModel.DataAnnotations;

namespace LiveScore.Model.ViewModel
{
    public class MatchUp
    {
        public string? MatchStatus { get; set; }
        public string MatchType { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MatchDate { get; set; }
    }
}
