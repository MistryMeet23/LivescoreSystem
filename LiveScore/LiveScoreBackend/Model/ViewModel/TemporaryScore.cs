using System.ComponentModel.DataAnnotations;

namespace LiveScore.Model.ViewModel
{
    public class TemporaryScore
    {
        [Key]
        public int TempScoreId { get; set; }
        public int? RedPoints { get; set; }
        public int? BluePoints { get; set; }
        public int? RedPanelty { get; set; }
        public int? BluePanelty { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? ScoreTime { get; set; }
        public int? Rounds { get; set; }
        public int? AthleteRed { get; set; }
        public int? AthleteBlue { get; set; }
        public int? MatchId { get; set; }
    }
}
