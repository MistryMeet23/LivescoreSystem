using System.ComponentModel.DataAnnotations;

namespace LiveScore.Model.ViewModel
{
    public class RefScore
    {
        [Key]
        public int Id { get; set; }
        public int? RedPoints { get; set; }
        public int? BluePoints { get; set; }
        public int? RedPenalty { get; set; }
        public int? BluePenalty { get; set; }
        public int RefereeId { get; set; } // Add referee reference
    }
}
