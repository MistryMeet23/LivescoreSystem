using System.ComponentModel.DataAnnotations;

namespace LiveScoring.Model
{
    public class Category
    {
        public int Id { get; set; }
        public string? CategoryName { get; set; }
        public int? MinWeight  { get; set; }
        public int? MaxWeight  { get; set; }
        public string? Gender  { get; set; }
        public int? MinAge  { get; set; }
        public int? MaxAge  { get; set; }
    }
}
