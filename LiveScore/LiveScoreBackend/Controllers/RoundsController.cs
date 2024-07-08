using LiveScore.Data;
using LiveScore.Model.ViewModel;
using LiveScore.Services;
using LiveScoring.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoundsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<ScoreHub> _hubContext;
        private readonly TempDbContext _tempContext;
        public RoundsController(ApplicationDbContext context, IHubContext<ScoreHub> hubContext, TempDbContext tempContext)
        {
            _context = context;
            _hubContext = hubContext;
            _tempContext = tempContext;
        }


        [HttpGet("GetRounds")]
        public async Task<ActionResult<IEnumerable<Round>>> GetRounds()
        {
            if (_context.Rounds == null)
            {
                return NotFound(new { error = "Rounds Not Found" });
            }
            return await _context.Rounds.ToListAsync();
        }

        [HttpGet("GetRoundsByMatchId/{mid}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetRoundsByMatchId(int mid)
        {
            try
            {
                var rounds = await _context.Rounds
                    .Include((a) => a.Athlete)
                    .Where(r => r.MatchId == mid)
                    .Select(r => new
                    {
                        //RoundId = r.Id,
                        Rounds = r.Rounds,
                        RoundWinner = r.Athlete.AthleteName,
                        RedTotalScore = r.RedTotalScore,
                        BlueTotalScore = r.BlueTotalScore,
                    })
                    .ToListAsync();

                if (rounds == null || !rounds.Any())
                {
                    return NotFound();
                }

                return rounds;
            }
            catch (Exception ex)
            {
                // Log the exception (you can use any logging library)
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "Internal server error, please try again later.");
            }
        }


        [HttpGet("GetScoresandRounds/{mid}/{round}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetScoresandRounds(int mid, int round)
        {
            try
            {
                var query = from score in _context.Scores
                            join roundData in _context.Rounds on score.MatchId equals roundData.Rounds
                            where score.MatchId == mid && roundData.Rounds == round
                            select new
                            {
                                sid = score.ScoreId,
                                RedPoints = score.RedPoints,
                                BluePoints = score.BluePoints,
                                RedPanelty = score.RedPanelty,
                                BluePanelty = score.BluePanelty,
                                ScoreTime = score.ScoreTime,
                                Rounds = score.Rounds,
                                AthleteRed = score.AthleteRedObj.AthleteName,
                                AthleteBlue = score.AthleteBlueObj.AthleteName,
                                MatchId = score.Match.MatchType,
                                RoundTime = roundData.RoundTime,
                                RedTotalScore = roundData.RedTotalScore,
                                BlueTotalScore = roundData.BlueTotalScore,
                                RoundWinner = roundData.RoundWinner
                            };

                var scores = await query.ToListAsync();

                if (scores == null || !scores.Any())
                {
                    // Check if there are no matches pending for the given round
                    var isRoundCompleted = await _context.Scores.AnyAsync(s => s.MatchId == mid && s.Rounds == round);
                    if (!isRoundCompleted)
                    {
                        return NotFound($"Match is pending for round {round}.");
                    }
                    else
                    {
                        return NotFound($"No scores found for match {mid} and round {round}.");
                    }
                }

                return scores;
            }
            catch (Exception ex)
            {
                // Log the exception (you can use any logging library)
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "Internal server error, please try again later.");
            }
        }

        [HttpPost("insertRound/{matchId}")]
        public async Task<IActionResult> InsertRound([FromBody] RoundVm roundDto, int matchId)
        {
            if (matchId == null)
            {
                return BadRequest("MatchId is required.");
            }

            // Validate the matchId exists
            var match = await _context.Matchss.FirstOrDefaultAsync(m => m.MId == matchId);
            if (match == null)
            {
                return NotFound("Match not found.");
            }

            // Update the match status
            match.MatchStatus = "Live";
            _context.Matchss.Update(match);

            // Insert initial round with user-specified values
            var initialRound = new Round
            {
                MatchId = matchId,
                Rounds = roundDto.Rounds,
                RoundTime = roundDto.RoundTime
            };

            _context.Rounds.Add(initialRound);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(matchId.ToString()).SendAsync("GetRounds", initialRound.Rounds);

            return Ok(new { msg = "Round inserted and match status updated.", round = initialRound });
        }


        [HttpPost("updateRound/{matchId}/{round}")]
        public async Task<IActionResult> UpdateRound(Round roundDto, int matchId, int round)
        {
            // Validate the matchId exists
            var matchExists = await _context.Matchss.AnyAsync(m => m.MId == matchId);
            if (!matchExists)
            {
                return NotFound(new { msg = "Match not found." });
            }

            // Find the specific round to update
            var roundToUpdate = await _context.Rounds.FirstOrDefaultAsync(r => r.MatchId == matchId && r.Rounds == round);

            if (roundToUpdate == null)
            {
                return NotFound(new { msg = "Round not found." });
            }

            // Update the specified fields
            roundToUpdate.RedTotalScore = roundDto.RedTotalScore;
            roundToUpdate.BlueTotalScore = roundDto.BlueTotalScore;
            roundToUpdate.RoundWinner = roundDto.RoundWinner;

            // Validate RoundWinner
            var match = await _context.Matchss.FindAsync(matchId);
            if (roundToUpdate.RoundWinner.HasValue)
            {
                if (roundToUpdate.RoundWinner != match.AthleteRed && roundToUpdate.RoundWinner != match.AthleteBlue)
                {
                    return BadRequest(new { msg = "RoundWinner must be one of the athletes in the match." });
                }
            }

            _context.Rounds.Update(roundToUpdate);
            await _context.SaveChangesAsync();

            // Delete temporary scores related to the round
            var tempScores = await _tempContext.TemporaryScores.Where(t => t.MatchId == matchId && t.Rounds == round).ToListAsync();
            if (tempScores.Any())
            {
                _tempContext.TemporaryScores.RemoveRange(tempScores);
                await _tempContext.SaveChangesAsync();
            }

            var roundswinner = new List<object>();

            if (round == 1)
            {
                var round1 = await _context.Rounds
                    .Include(r => r.Athlete) // Include the Athlete navigation property
                    .FirstOrDefaultAsync(r => r.MatchId == matchId && r.Rounds == 1);

                var round1WinnerName = round1?.Athlete?.AthleteName; // Assuming the Athlete class has a Name property
                roundswinner.Add(new { round = 1, roundWinnerName = round1WinnerName, roundWinnerId = round1.RoundWinner });

                await _hubContext.Clients.All.SendAsync("ReceiveRoundWinner", roundswinner);

                return Ok(new { msg = "Round 1 updated successfully.", roundWinner = round1WinnerName, roundswinner });
            }
            // Check if round is 2 and fetch round 1 details
            if (round == 2)
            {
                var round1 = await _context.Rounds
                    .Include(r => r.Athlete)
                    .FirstOrDefaultAsync(r => r.MatchId == matchId && r.Rounds == 1);

                if (round1 != null && round1.RoundWinner == roundDto.RoundWinner)
                {
                    var rounds = await _context.Rounds
                        .Include(r => r.Athlete) // Include the Athlete navigation property for rounds
                        .Where(r => r.MatchId == matchId)
                        .Select(r => new { r.Rounds, RoundWinnerName = r.Athlete.AthleteName })
                        .ToListAsync();
                    ;

                    var round2 = await _context.Rounds
                   .Include(r => r.Athlete) // Include the Athlete navigation property
                   .FirstOrDefaultAsync(r => r.MatchId == matchId && r.Rounds == 2);

                    var round1WinnerName = round1?.Athlete?.AthleteName; // Assuming the Athlete class has a Name property
                    var round2WinnerName = round2?.Athlete?.AthleteName; // Assuming the Athlete class has a Name property
                    roundswinner.Add(new { round = 1, roundWinnerName = round1WinnerName, roundWinnerId = round1.RoundWinner });
                    roundswinner.Add(new { round = 2, roundWinnerName = round2WinnerName, roundWinnerId = round2.RoundWinner });

                    await _hubContext.Clients.All.SendAsync("ReceiveRoundWinner", roundswinner);

                    return Ok(new { msg = "Round winner for round 2 or 3 is same as round 1", roundswinner });
                }
            }

            if (round == 3)
            {
                var round1 = await _context.Rounds
                    .Include(r => r.Athlete)
                    .FirstOrDefaultAsync(r => r.MatchId == matchId && r.Rounds == 1);

                var round2 = await _context.Rounds
                    .Include(r => r.Athlete)
                    .FirstOrDefaultAsync(r => r.MatchId == matchId && r.Rounds == 2);

                if (round1 != null && round2 != null)
                {
                    var round1WinnerName = round1?.Athlete?.AthleteName; // Assuming the Athlete class has a Name property
                    var round2WinnerName = round2?.Athlete?.AthleteName; // Assuming the Athlete class has a Name property
                    roundswinner.Add(new { round = 1, roundWinnerName = round1WinnerName, roundWinnerId = round1.RoundWinner });
                    roundswinner.Add(new { round = 2, roundWinnerName = round2WinnerName, roundWinnerId = round2.RoundWinner });
                    roundswinner.Add(new { round = 3, roundWinnerName = (roundDto.RoundWinner == match.AthleteRed ? match.AthleteRedObj.AthleteName : match.AthleteBlueObj.AthleteName), roundWinnerId = roundDto.RoundWinner });



                    // Calculate total time each athlete has spent as RoundWinner
                    var roundWinners = new List<int?> { round1.RoundWinner, round2.RoundWinner, roundDto.RoundWinner };
                    var athleteRoundTime = roundWinners
                        .GroupBy(w => w)
                        .ToDictionary(g => g.Key, g => g.Count());

                    // Determine the winner of the match
                    int? matchWinnerId = athleteRoundTime.OrderByDescending(x => x.Value).FirstOrDefault().Key;
                    var matchWinnerName = matchWinnerId.HasValue
                        ? (matchWinnerId == match.AthleteRed ? match.AthleteRedObj.AthleteName : match.AthleteBlueObj.AthleteName)
                        : null;

                    await _hubContext.Clients.All.SendAsync("ReceiveRoundWinner", roundswinner);

                    return Ok(new
                    {
                        msg = "Round 3 validation",
                        roundswinner,
                        roundWinner = matchWinnerName
                    });
                }
            }

            var rounds1 = await _context.Rounds
                    .Include(r => r.Athlete)
                    .FirstOrDefaultAsync(r => r.MatchId == matchId && r.Rounds == 1);

            var rounds2 = await _context.Rounds
                .Include(r => r.Athlete)
                .FirstOrDefaultAsync(r => r.MatchId == matchId && r.Rounds == 2);

            var rounds1WinnerName = rounds1?.Athlete?.AthleteName; // Assuming the Athlete class has a Name property
            var rounds2WinnerName = rounds2?.Athlete?.AthleteName; // Assuming the Athlete class has a Name property
             roundswinner.Add(new { round = 1, roundWinnerName = rounds1WinnerName, roundWinnerId = rounds1.RoundWinner });
            roundswinner.Add(new { round = 2, roundWinnerName = rounds2WinnerName, roundWinnerId = rounds2.RoundWinner });
            await _hubContext.Clients.All.SendAsync("ReceiveRoundWinner", roundswinner);

            return Ok(new { msg = "Round updated successfully.", roundswinner, roundRes = roundToUpdate.Rounds });
        }

        private bool RoundExists(int id)
        {
            return (_context.Rounds?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
