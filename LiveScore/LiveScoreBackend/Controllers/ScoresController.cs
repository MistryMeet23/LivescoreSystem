using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LiveScore.Data;
using LiveScoring.Model;
using LiveScore.Model.ViewModel;
using Microsoft.OpenApi.Writers;
using LiveScore.Services;
using Microsoft.AspNetCore.SignalR;

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly TempDbContext _tempContext;
        private readonly ITimerService _timerService;
        private readonly IHubContext<ScoreHub> _hubContext;
        private readonly ILogger<ScoresController> _logger;

        public ScoresController(ApplicationDbContext context, TempDbContext tempContext, ITimerService timerService, IHubContext<ScoreHub> hubContext, ILogger<ScoresController> logger)
        {
            _context = context;
            _tempContext = tempContext;
            _timerService = timerService;
            _hubContext = hubContext;
            _logger = logger;

            // Subscribe to the TimerElapsed event
            //_timerService.TimerElapsed += async (sender, matchGroup) => await TransferScores(matchGroup);

        }

        // GET: api/Scores
        [HttpGet("GetScores")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetScores()
        {
            if (_context.Scores == null)
            {
                return NotFound();
            }
            return await _context.Scores
                //.Include((a) => a.Round)
                .Include((r) => r.AthleteRedObj)
                .Include((b) => b.AthleteBlueObj)
                .Include((m) => m.Match)
                .Select(s => new
                {
                    scoreId = s.ScoreId,
                    redPoints = s.RedPoints,
                    bluePoints = s.BluePoints,
                    redPanelty = s.RedPanelty,
                    bluePanelty = s.BluePanelty,
                    scoreTime = s.ScoreTime,
                    rounds = s.Rounds,
                    athleteRed = s.AthleteRedObj.AthleteName,
                    athleteBlue = s.AthleteBlueObj.AthleteName,
                    matchId = s.Match.MatchType
                }).ToListAsync();
        }

        // Add this code to the ScoresController class
        [HttpGet("GetTemporaryScores")]
        public async Task<ActionResult<IEnumerable<TemporaryScore>>> GetTemporaryScores()
        {
            if (_tempContext.TemporaryScores == null)
            {
                return NotFound();
            }
            return await _tempContext.TemporaryScores.ToListAsync();
        }
        // Add this code to the ScoresController class

        //[HttpGet("GetTemporaryScores/{matchId}")]
        //public async Task<ActionResult<IEnumerable<TemporaryScore>>> GetTemporaryScores([FromQuery] int matchId)
        //{
        //    if (_tempContext.TemporaryScores == null)
        //    {
        //        return NotFound();
        //    }

        //    var scores = await _tempContext.TemporaryScores
        //                               .Where(score => score.MatchId == matchId)
        //                               .ToListAsync();

        //    if (scores == null || !scores.Any())
        //    {
        //        return NotFound();
        //    }

        //    return scores;
        //}


        // GET: api/TemporaryScore/{id}
        [HttpGet("getTemporaryScoreById/{id}")]
        public ActionResult<TemporaryScore> getTemporaryScoreById(int id)
        {
            var tempScore = _tempContext.TemporaryScores.Find(id);
            if (tempScore == null)
            {
                return NotFound();
            }
            return tempScore;
        }

        // PUT: api/Scores/EditTemporaryScore/{id}
        [HttpPut("EditTemporaryScore/{id}/{mid}")]
        public async Task<IActionResult> EditTemporaryScore(int id,int mid, [FromBody] TempScoreVm tempScoreVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTempScore = await _tempContext.TemporaryScores.FindAsync(id);
            if (existingTempScore == null)
            {
                _logger.LogWarning($"Temporary score with ID {id} not found.");
                return NotFound(new { Message = "Temporary score not found" });
            }

            // Log current state
            _logger.LogInformation($"Current state of TemporaryScore (ID: {id}): {existingTempScore}");

            // Update only the fields present in TempScoreVm
            existingTempScore.RedPoints = tempScoreVm.RedPoints;
            existingTempScore.BluePoints = tempScoreVm.BluePoints;
            existingTempScore.RedPanelty = tempScoreVm.RedPanelty;
            existingTempScore.BluePanelty = tempScoreVm.BluePanelty;
            existingTempScore.ScoreTime = tempScoreVm.ScoreTime;

            // Explicitly mark the entity as modified
            _tempContext.Entry(existingTempScore).State = EntityState.Modified;

            try
            {
                await _tempContext.SaveChangesAsync();
                _logger.LogInformation($"TemporaryScore with ID {id} updated successfully.");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!TemporaryScoreExists(id))
                {
                    _logger.LogError($"Concurrency issue: Temporary score with ID {id} not found during update.");
                    return NotFound(new { Message = "Concurrency issue: Temporary score not found during update" });
                }
                else
                {
                    _logger.LogError($"Concurrency exception: {ex.Message}");
                    throw;
                }
            }
            var totalRedPoints = await _tempContext.TemporaryScores.SumAsync(ts => (ts.RedPoints ?? 0) + (ts.BluePanelty ?? 0));
            var totalBluePoints = await _tempContext.TemporaryScores.SumAsync(ts => (ts.BluePoints ?? 0) + (ts.RedPanelty ?? 0));
            var RedPanelty = await _tempContext.TemporaryScores.SumAsync(ts => ts.RedPanelty ?? 0);
            var BluePanelty = await _tempContext.TemporaryScores.SumAsync(ts => ts.BluePanelty ?? 0);

            await _hubContext.Clients.Group(mid.ToString()).SendAsync("ReceiveTotalScore", new
            {
                totalRedPoints,
                totalBluePoints,
                RedPanelty,
                BluePanelty
            });
            return Ok(new {msg = "Successfully Update"});
        }
        private bool TemporaryScoreExists(int id)
        {
            return _tempContext.TemporaryScores.Any(e => e.TempScoreId == id);
        }

        [HttpGet("getTotalScore")]
        public async Task<ActionResult<dynamic>> GetTotalScore()
        {
            var RedTotalScore = await _tempContext.TemporaryScores.SumAsync(ts => (ts.RedPoints ?? 0) + (ts.BluePanelty ?? 0));
            var BlueTotalScore = await _tempContext.TemporaryScores.SumAsync(ts => (ts.BluePoints ?? 0) + (ts.RedPanelty ?? 0));
            var RedPanelty = await _tempContext.TemporaryScores.SumAsync(ts => ts.RedPanelty ?? 0);
            var BluePanelty = await _tempContext.TemporaryScores.SumAsync(ts => ts.BluePanelty ?? 0);

            return Ok(new
            {
                RedTotalScore,
                BlueTotalScore,
                RedPanelty,
                BluePanelty
            });
        }

        [HttpPost("insert/{rounds}/{athleteRed}/{athleteBlue}/{matchId}")]
        public async Task<IActionResult> InsertTemporaryScore([FromBody] TempScoreVm tempScorevm, int rounds, int athleteRed, int athleteBlue, int matchId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tempScore = new TemporaryScore
            {
                RedPoints = tempScorevm.RedPoints ?? 0,
                BluePoints = tempScorevm.BluePoints ?? 0,
                RedPanelty = tempScorevm.RedPanelty ?? 0,
                BluePanelty = tempScorevm.BluePanelty ?? 0,
                ScoreTime = DateTime.Now,
                Rounds = rounds,
                AthleteRed = athleteRed,
                AthleteBlue = athleteBlue,
                MatchId = matchId,

            };

            _tempContext.TemporaryScores.Add(tempScore);
            await _tempContext.SaveChangesAsync();

            var totalRedPoints = await _tempContext.TemporaryScores.SumAsync(ts => (ts.RedPoints ?? 0) + (ts.BluePanelty ?? 0));
            var totalBluePoints = await _tempContext.TemporaryScores.SumAsync(ts => (ts.BluePoints ?? 0) + (ts.RedPanelty ?? 0)); 
            var RedPanelty = await _tempContext.TemporaryScores.SumAsync(ts => ts.RedPanelty ?? 0);
            var BluePanelty = await _tempContext.TemporaryScores.SumAsync(ts => ts.BluePanelty ?? 0);

            await _hubContext.Clients.Group(matchId.ToString()).SendAsync("ReceiveTotalScore", new
            {
                totalRedPoints,
                totalBluePoints,
                RedPanelty,
                BluePanelty
            });

            return Ok(new
            {
                msg = "Score inserted into temporary table",
                totalRedPoints,
                totalBluePoints,
                RedPanelty,
                BluePanelty
            });
        }

        [HttpPost("transfer/{mid}")]
        public async Task<IActionResult> TransferScores(int mid)
        {
            var tempScores = _tempContext.TemporaryScores.Where(ts => ts.MatchId == mid).ToList();
            if (tempScores.Count == 0)
            {
                return NotFound(new { msg = "No scores found in temporary table for the match group" });
            }

            foreach (var tempScore in tempScores)
            {
                // Check if related entities exist with combined condition for Rounds and MatchId
                var roundExists = _context.Rounds.Any(r => r.MatchId == tempScore.MatchId && r.Rounds == tempScore.Rounds);
                var athleteRedExists = _context.Athletes.Any(a => a.Id == tempScore.AthleteRed);
                var athleteBlueExists = _context.Athletes.Any(a => a.Id == tempScore.AthleteBlue);
                var matchExists = _context.Matchss.Any(m => m.MId == tempScore.MatchId);

                if (!roundExists || !athleteRedExists || !athleteBlueExists || !matchExists)
                {
                    return BadRequest(new { msg = "One or more foreign key references are invalid." });
                }

                var score = new Score
                {
                    RedPoints = tempScore.RedPoints ?? 0,
                    BluePoints = tempScore.BluePoints ?? 0,
                    RedPanelty = tempScore.RedPanelty ?? 0,
                    BluePanelty = tempScore.BluePanelty ?? 0,
                    ScoreTime = tempScore.ScoreTime,
                    Rounds = tempScore.Rounds,
                    AthleteRed = tempScore.AthleteRed,
                    AthleteBlue = tempScore.AthleteBlue,
                    MatchId = tempScore.MatchId
                };
                _context.Scores.Add(score);
            }
            await _context.SaveChangesAsync();
            await _tempContext.SaveChangesAsync();

            return Ok(new { msg = "Scores transferred from temporary to real table" });
        }
        private bool IsCoordinator(int matchGroup, int acrId)
        {
            var match = _context.Matchss.FirstOrDefault(m => m.MatchGroup == matchGroup);
            return match != null && match.MatchCoordinator == acrId;
        }
        private bool IsReferee1(int matchGroup, int acrId)
        {
            var match = _context.Matchss.FirstOrDefault(m => m.MatchGroup == matchGroup);
            return match != null && match.Referee1 == acrId;
        }

        [HttpPost("join")]
        public async Task<IActionResult> JoinGroup(int matchGroup, int acrId, string connectionId)
        {
            try
            {
                var match = _context.Matchss.FirstOrDefault(m => m.MatchGroup == matchGroup);
                if (match == null) return NotFound("Match not found");

                if (!IsCoordinator(matchGroup, acrId) && !IsReferee1(matchGroup, acrId))
                    return Forbid("Only MatchCoordinator and Referee1 can join the group");

                await _hubContext.Groups.AddToGroupAsync(connectionId, matchGroup.ToString());

                var joinDetails = new
                {
                    MatchId = match.MId,
                    acrId = acrId,
                    Group = match.MatchGroup
                };

                return Ok(joinDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while adding the user to the group: {ex.Message}");
            }
        }

        [HttpPost("leave")]
        public async Task<IActionResult> LeaveGroup(int matchGroup, int acrId, string connectionId)
        {
            try
            {
                var match = _context.Matchss.FirstOrDefault(m => m.MatchGroup == matchGroup);
                if (match == null) return NotFound(new { msg = "Match not found" });

                await _hubContext.Groups.RemoveFromGroupAsync(connectionId, matchGroup.ToString());
                return Ok(new { msg = "Leave the Group" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while removing the user from the group: {ex.Message}");
            }
        }


        [HttpPost("start/{matchGroup}/{acrId}/{duration}")]
        public async Task<IActionResult> StartCountdown(int matchGroup, int acrId, int duration)
        {
            try
            {
                // Add your authorization logic here
                if (!IsCoordinator(matchGroup, acrId))
                    return BadRequest(new { msg = "Only MatchCoordinator can start the countdown" });

                _timerService.StartTimer(matchGroup, duration);
                await _hubContext.Clients.Group(matchGroup.ToString()).SendAsync("StartCountdown", duration);
                return Ok(new { msg = $"Timer started with duration {duration} seconds" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = $"An error occurred while starting the countdown: {ex.Message}" });
            }
        }

        [HttpPost("stop/{matchGroup}/{acrId}")]
        public async Task<IActionResult> StopCountdown(int matchGroup, int acrId)
        {
            try
            {
                // Add your authorization logic here
                if (!IsCoordinator(matchGroup, acrId))
                    return BadRequest(new { msg = "Only MatchCoordinator can stop the countdown" });

                _timerService.StopTimer(matchGroup);
                await _hubContext.Clients.Group(matchGroup.ToString()).SendAsync("StopCountdown");
                return Ok(new { msg = "Timer stopped" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = $"An error occurred while stopping the countdown: {ex.Message}" });
            }
        }

        [HttpPost("pause/{matchGroup}/{acrId}")]
        public async Task<IActionResult> PauseCountdown(int matchGroup, int acrId)
        {
            try
            {
                // Add your authorization logic here
                if (!IsCoordinator(matchGroup, acrId))
                    return BadRequest(new { msg = "Only MatchCoordinator can pause the countdown" });

                _timerService.PauseTimer(matchGroup);
                await _hubContext.Clients.Group(matchGroup.ToString()).SendAsync("PauseCountdown");
                return Ok(new { msg = "Timer paused" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = $"An error occurred while pausing the countdown: {ex.Message}" });
            }
        }

        [HttpPost("resume/{matchGroup}/{acrId}")]
        public async Task<IActionResult> ResumeTimer(int matchGroup, int acrId)
        {
            try
            {
                // Add your authorization logic here
                if (!IsCoordinator(matchGroup, acrId))
                    return BadRequest(new { msg = "Only MatchCoordinator can resume the countdown" });

                _timerService.ResumeTimer(matchGroup);
                await _hubContext.Clients.Group(matchGroup.ToString()).SendAsync("ResumeCountdown");
                return Ok(new { msg = "Timer resumed" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = $"An error occurred while resuming the countdown: {ex.Message}" });
            }
        }

        // DELETE: api/Scores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScore(int id)
        {
            if (_context.Scores == null)
            {
                return NotFound();
            }
            var score = await _context.Scores.FindAsync(id);
            if (score == null)
            {
                return NotFound();
            }

            _context.Scores.Remove(score);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
