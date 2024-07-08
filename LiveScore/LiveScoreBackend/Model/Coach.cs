namespace LiveScore.Model
{
    public class Coach
    {
        public int CoachId { get; set; }
        public string CoachName { get; set;}
        public string Gender { get; set;}
        public string ImageUrl { get; set; }
        public string CoachEmail { get; set;}
        public string ContactNo { get; set; }
        public string Status { get; set; } = "UnBlock";
        public string Experience { get; set; }
        public string Achievements { get; set; }

    }
}
