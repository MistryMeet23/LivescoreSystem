using LiveScore.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommonController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("totalcount")]
        public async Task<ActionResult<int>> GetTotalCount()
        {
            var athleteCount = await _context.Athletes.CountAsync();
            var coachCount = await _context.Coaches.CountAsync();
            var coordinatorCount = await _context.Admin.CountAsync(acr => acr.RoleId == 3);
            var refereeCount = await _context.Admin.CountAsync(acr => acr.RoleId == 4);

            var result = new
            {
                TotalAthletes = athleteCount,
                TotalCoaches = coachCount,
                TotalCoordinators = coordinatorCount,
                TotalReferees = refereeCount
            };

            return Ok(result);
        }
        [HttpGet("categoryViseAthlete")]
        public async Task<ActionResult> GetCategoryViseAthlete()
        {
            var categoryTotals = await _context.Athletes
                .GroupBy(a => a.CategoryId)
                .Select(g => new
                {
                    CategoryId = g.Key,
                    TotalAthletes = g.Count()
                })
                .ToListAsync();

            var result = await _context.Categories
                .ToListAsync();

            var response = result.Select(c => new
            {
                c.Id,
                c.CategoryName,
                TotalAthletes = categoryTotals.FirstOrDefault(ct => ct.CategoryId == c.Id)?.TotalAthletes ?? 0
            }).ToList();

            return Ok(response);
        }

        [HttpGet("matchesPerWeek/{month}/{year}")]
        public async Task<ActionResult> GetMatchesPerWeek(int month, int year)
        {
            var matches = await _context.Matchss
                .Where(m => m.MatchDate.HasValue && m.MatchDate.Value.Month == month && m.MatchDate.Value.Year == year)
                .ToListAsync();

            var weeklyMatches = matches
                .GroupBy(m => CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(
                    m.MatchDate.Value, CalendarWeekRule.FirstDay, DayOfWeek.Monday))
                .Select(g => new
                {
                    Week = g.Key,
                    MatchCount = g.Count()
                })
                .OrderBy(x => x.Week)
                .ToList();

            return Ok(weeklyMatches);
        }

        [HttpGet("todays-winners")]
        public async Task<ActionResult> GetTodaysMatchWinners()
        {
            var today = DateTime.Today;
            var todaysMatches = await _context.Matchss
                .Where(m => m.MatchDate.HasValue && m.MatchDate.Value.Date == today)
                .Include(m => m.Tournament)
                .Include(m => m.Category)
                .Include(m => m.AthleteRedObj)
                .Include(m => m.AthleteBlueObj)

                .ToListAsync();

            var winners = todaysMatches
                .Where(m => m.Flag.HasValue)
                .Select(m => new
                {
                    WinnerName = m.Flag == m.AthleteRed ? m.AthleteRedObj.AthleteName : m.AthleteBlueObj.AthleteName,
                    AthleteRed = m.AthleteRedObj.AthleteName,
                    AthleteBlue = m.AthleteBlueObj.AthleteName,
                    CategoryName = m.Category?.CategoryName,
                    TournamentName = m.Tournament?.TournamentName,
                    Gender = m.Gender
                })
                .ToList();

            return Ok(winners);
        }
    }
}

