using LiveScore.Model.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace LiveScore.Data
{
    public class TempDbContext:DbContext
    {
        public TempDbContext(DbContextOptions<TempDbContext> options) : base(options) { }

        public DbSet<TemporaryScore> TemporaryScores { get; set; }
        public DbSet<RefScore> RefScores { get; set; }
    }
}
