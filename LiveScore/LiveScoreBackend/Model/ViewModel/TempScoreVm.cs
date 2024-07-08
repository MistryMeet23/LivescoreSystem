using System.ComponentModel.DataAnnotations;

namespace LiveScore.Model.ViewModel
{
    public class TempScoreVm
    {
        public int? RedPoints { get; set; }
        public int? BluePoints { get; set; }
        public int? RedPanelty { get; set; }
        public int? BluePanelty { get; set; }

        [DataType(DataType.DateTime)]   
        public DateTime? ScoreTime { get; set; }
    }
}
