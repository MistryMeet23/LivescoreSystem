using LiveScore.Model;
using System.ComponentModel.DataAnnotations;

namespace LiveScoring.Model
{
    public class Role
    {
        public int Id { get; set; }
        public string? role { get; set; }

     //   public ICollection<ACR> acr { get; }
    }
}
