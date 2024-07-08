using LiveScore.Model;
using LiveScoring.Model;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace LiveScore.Data
{
    public class ApplicationDbContext :DbContext
    {
        public ApplicationDbContext()
        {
            
        }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<ACR> Admin { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Coach> Coaches { get; set; } = null!;
        public DbSet<Athlete> Athletes { get; set; } = null!;
        public DbSet<Matchs> Matchss { get; set; } = null!;
        public DbSet<Round> Rounds { get; set; } = null!;
        public DbSet<Score> Scores { get; set; } = null!;
        public DbSet<Tournament> Tournaments { get; set; } = null!;
        public DbSet<Viewers> Viewerss { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.role)
                    .HasMaxLength(101);
            });

            modelBuilder.Entity<ACR>(entity =>
            {
                entity.HasKey(e => e.Id); 

                entity.Property(e => e.Email).IsRequired().HasMaxLength(101); 

                entity.Property(e => e.Name).IsRequired().HasMaxLength(101); 

                entity.Property(e => e.Password).IsRequired().HasMaxLength(101);

                entity.Property(e => e.ImageURL); 

                entity.Property(e => e.Contact).IsRequired().HasMaxLength(101); 

                entity.Property(e => e.Age).IsRequired().HasMaxLength(10); 
                
                entity.Property(e => e.Status);

                entity.Property(e => e.DateOfBirth).IsRequired(); 

                entity.Property(e => e.LastLogin).IsRequired(false);  

                entity.Property(e => e.Gender).IsRequired(false).HasMaxLength(101); 

                entity.Property(e => e.City).IsRequired(false).HasMaxLength(101); 

                entity.Property(e => e.State).IsRequired(false).HasMaxLength(101); 

                entity.Property(e => e.RoleId).IsRequired(false);

                entity.HasOne(e => e.Role)
                    .WithMany()
                    .HasForeignKey(e => e.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Id).HasColumnName("Cid"); 
                entity.Property(c => c.CategoryName).IsRequired().HasMaxLength(101); 
                entity.Property(c => c.Gender).IsRequired(false).HasMaxLength(10); 
                entity.Property(c => c.MinAge).IsRequired().HasMaxLength(10); 
                entity.Property(c => c.MaxAge).IsRequired().HasMaxLength(10); 
                entity.Property(c => c.MinWeight).IsRequired().HasMaxLength(10); 
                entity.Property(c => c.MaxWeight).IsRequired().HasMaxLength(10); 
            });
            modelBuilder.Entity<Coach>(entity =>
            {
                entity.HasKey(c => c.CoachId); 
                entity.Property(c => c.CoachName).IsRequired().HasMaxLength(101); 
                entity.Property(c => c.Gender).IsRequired().HasMaxLength(101); 
                entity.Property(c => c.CoachEmail).IsRequired().HasMaxLength(101);
                entity.Property(c => c.ContactNo).IsRequired().HasMaxLength(101);
                entity.Property(a => a.Status).IsRequired(false).HasMaxLength(101);
                entity.Property(c => c.Experience).IsRequired().HasMaxLength(101); 
                entity.Property(c => c.Achievements).IsRequired().HasMaxLength(101);

            });

            modelBuilder.Entity<Athlete>(entity =>
            {
                entity.HasKey(a => a.Id); 

                entity.Property(a => a.AthleteName).IsRequired().HasMaxLength(101);
                entity.Property(a => a.Email).IsRequired().HasMaxLength(101); 
                entity.Property(a => a.Contact).IsRequired().HasMaxLength(101); 
                entity.Property(a => a.ImageUrl); 
                entity.Property(a => a.DateOfBirth).IsRequired().HasMaxLength(101); 
                entity.Property(a => a.Gender).IsRequired().HasMaxLength(101);
                entity.Property(a => a.Height).IsRequired(); 
                entity.Property(a => a.Weight).IsRequired(false); 
                entity.Property(a => a.City).IsRequired().HasMaxLength(101); 
                entity.Property(a => a.State).IsRequired().HasMaxLength(101);
                entity.Property(a => a.Status).IsRequired(false).HasMaxLength(101);
                entity.Property(a => a.CoachId).IsRequired();
                entity.Property(a => a.Coordinater).IsRequired(); 
                entity.Property(a => a.CategoryId).IsRequired(); 

                entity.HasOne(a => a.Category)
                    .WithMany()
                    .HasForeignKey(a => a.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict); 

                entity.HasOne(a => a.Coach)
                .WithMany()
                .HasForeignKey(a => a.CoachId)
                .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(a => a.acr)
                    .WithMany()
                    .HasForeignKey(a => a.Coordinater)
                    .OnDelete(DeleteBehavior.Restrict); 
            });

            modelBuilder.Entity<Matchs>(entity =>
            {
                entity.HasKey(m => m.MId); 

                entity.Property(m => m.MatchStatus).IsRequired(false).HasMaxLength(101); 
                entity.Property(m => m.MatchType).HasMaxLength(101);
                entity.Property(r => r.MatchDate).IsRequired();
                entity.Property(m => m.AthleteRed).IsRequired(false); 
                entity.Property(m => m.AthleteBlue).IsRequired(false); 
                entity.Property(m => m.NextMatchId); 
                entity.Property(m => m.MatchGroup); 
                entity.Property(m => m.Gender); 
                entity.Property(m => m.Flag).IsRequired(false);
                entity.Property(m => m.CategoryId).IsRequired(false); 
                entity.Property(m => m.MatchCoordinator).IsRequired(false); 
                entity.Property(m => m.Referee1).IsRequired(false); 
                entity.Property(m => m.Referee2).IsRequired(false); 
                entity.Property(m => m.Referee3).IsRequired(false); 
                entity.Property(m => m.CategoryId).IsRequired(false); 
                entity.Property(m => m.TournamentId).IsRequired();


                entity.HasOne(m => m.Tournament)
                .WithMany()
                .HasForeignKey(m => m.TournamentId)
                .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(m => m.Category)
                    .WithMany()
                    .HasForeignKey(m => m.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict); 

                entity.HasOne(m => m.AthleteRedObj)
                    .WithMany()
                    .HasForeignKey(m => m.AthleteRed)
                    .OnDelete(DeleteBehavior.Restrict); 

                entity.HasOne(m => m.AthleteBlueObj)
                    .WithMany()
                    .HasForeignKey(m => m.AthleteBlue)
                    .OnDelete(DeleteBehavior.Restrict); 
                
                entity.HasOne(m => m.Athleteflag)
                    .WithMany()
                    .HasForeignKey(m => m.Flag)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Coordinator)
                   .WithMany()
                   .HasForeignKey(a => a.MatchCoordinator)
                   .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.RefereeF)
                   .WithMany()
                   .HasForeignKey(a => a.Referee1)
                   .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.RefereeS)
                   .WithMany()
                   .HasForeignKey(a => a.Referee2)
                   .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.RefereeT)
                   .WithMany()
                   .HasForeignKey(a => a.Referee3)
                   .OnDelete(DeleteBehavior.Restrict);
            });

                modelBuilder.Entity<Round>(entity =>
                {
                    entity.HasKey(r => r.Id); 

                    entity.Property(r => r.Rounds).IsRequired().HasMaxLength(11); 
                    entity.Property(r => r.RoundTime).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP"); 
                    entity.Property(r => r.RedTotalScore).IsRequired(false); 
                    entity.Property(r => r.BlueTotalScore).IsRequired(false); 
                    entity.Property(r => r.RoundWinner).IsRequired(false); 
                    entity.Property(r => r.MatchId).IsRequired(false); 

                    entity.HasOne(r => r.Match)
                        .WithMany()
                        .HasForeignKey(r => r.MatchId)
                        .OnDelete(DeleteBehavior.Restrict); 
                    
                    entity.HasOne(r => r.Athlete)
                        .WithMany()
                        .HasForeignKey(r => r.RoundWinner)
                        .OnDelete(DeleteBehavior.Restrict); 
                });

                  modelBuilder.Entity<Score>(entity =>
                {
                    entity.HasKey(s => s.ScoreId); 
                    entity.Property(s => s.RedPoints).IsRequired().HasMaxLength(10); 
                    entity.Property(s => s.BluePoints).IsRequired().HasMaxLength(10); 
                    entity.Property(s => s.ScoreTime).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP"); 
                    entity.Property(s => s.Rounds).IsRequired(false); 
                    entity.Property(s => s.AthleteRed).IsRequired(false); 
                    entity.Property(s => s.AthleteBlue).IsRequired(false);
                    entity.Property(r => r.MatchId).IsRequired(false);

                    entity.HasOne(r => r.Match)
                        .WithMany()
                        .HasForeignKey(r => r.MatchId)
                        .OnDelete(DeleteBehavior.Restrict);

                    //entity.HasOne(s => s.Round)
                    //    .WithMany()
                    //    .HasForeignKey(s => s.Rounds)
                    //    .OnDelete(DeleteBehavior.Restrict); 

                    entity.HasOne(s => s.AthleteRedObj)
                        .WithMany()
                        .HasForeignKey(s => s.AthleteRed)
                        .OnDelete(DeleteBehavior.Restrict); 
                    entity.HasOne(s => s.AthleteBlueObj)
                        .WithMany()
                        .HasForeignKey(s => s.AthleteBlue)
                        .OnDelete(DeleteBehavior.Restrict); 
                }); 

            modelBuilder.Entity<Tournament>(entity =>
            {
                entity.HasKey(t => t.TId); 

                entity.Property(t => t.TournamentName).IsRequired().HasMaxLength(101); 
                entity.Property(t => t.Venue).IsRequired().HasMaxLength(101); 
                entity.Property(t => t.TournamentDate);
                entity.Property(t => t.TournamentCoordinator);

                entity.HasOne(a => a.Coordinator)
                   .WithMany()
                   .HasForeignKey(a => a.TournamentCoordinator)
                   .OnDelete(DeleteBehavior.Restrict);

            });

            modelBuilder.Entity<Viewers>(entity =>
            {
                entity.HasKey(e => e.VId);

                entity.Property(e => e.Email).IsRequired().HasMaxLength(101);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(101);

                entity.Property(e => e.Password).IsRequired().HasMaxLength(101);

                entity.Property(e => e.Image);

                entity.Property(e => e.Contact).IsRequired().HasMaxLength(10);

                entity.Property(e => e.Gender).IsRequired(false).HasMaxLength(101);

                entity.Property(e => e.State).IsRequired(false).HasMaxLength(101);

            });
        } 
    }
}
