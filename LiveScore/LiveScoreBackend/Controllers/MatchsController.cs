using LiveScore.Data;
using LiveScore.Model;
using LiveScore.Model.ViewModel;
using LiveScore.Services;
using LiveScoring.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Concurrent;
using System.IO;

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ACR> _logger;
        private readonly IMemoryCache _cache;
        private readonly IHubContext<ScoreHub> _hubContext;
        private static readonly TimeSpan _otpValidity = TimeSpan.FromMinutes(15); // OTP valid for 15 minutes
        private static readonly ConcurrentDictionary<string, bool> _otpKeys = new ConcurrentDictionary<string, bool>();

        public MatchsController(ApplicationDbContext context, IMemoryCache cache, IHubContext<ScoreHub> hubContext)
        {
            _context = context;
            _cache = cache;
            _hubContext = hubContext;
        }

        [HttpGet("GetMatchs")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetMatchs()
        {
            if (_context.Matchss == null)
            {
                return NotFound(new { msg = "Matchs Not Found" });
            }

            return await _context.Matchss.Include((c) => c.Category)
                .Include((o) => o.AthleteBlueObj)
                .Include((o) => o.AthleteRedObj)
                .Include((t) => t.Tournament)
                .Include((c)=> c.Coordinator)
                .Include((r) => r.RefereeF)
                .Include((r) => r.RefereeS)
                .Include((r) => r.RefereeT)
                .Where(a => a.MatchStatus != "disable")
                .Select((a) => new {
                   mid = a.MId,
                    matchGroup = a.MatchGroup,
                    matchStatus = a.MatchStatus,
                    matchType = a.MatchType,
                    matchDate = a.MatchDate,
                    athleteRed = a.AthleteRedObj.AthleteName,
                    athleteBlue = a.AthleteBlueObj.AthleteName,
                    athleteRedImg = a.AthleteRedObj.ImageUrl,
                    athleteBlueImg = a.AthleteBlueObj.ImageUrl,
                    nextMatchId =  a.NextMatchId,
                    gender = a.Gender,
                    flag = a.Flag,
                    categoryId = a.CategoryId,
                    category = a.Category.CategoryName,
                    matchCoordinator = a.Coordinator.Name,
                    referee1 = a.RefereeF.Name,
                    referee2 = a.RefereeS.Name,
                    referee3 = a.RefereeT.Name,
                    tournament = a.Tournament.TournamentName,

                }).ToListAsync();
        }
        
        [HttpGet("GetMatchHistory")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetMatchHistory()
        {
            if (_context.Matchss == null)
            {
                return NotFound(new { msg = "Matchs Not Found" });
            }

            return await _context.Matchss.Include((c) => c.Category)
                .Include((o) => o.AthleteBlueObj)
                .Include((o) => o.AthleteRedObj)
                .Include((o) => o.Athleteflag)
                .Include((t) => t.Tournament)
                .Include((c)=> c.Coordinator)
                .Include((r) => r.RefereeF)
                .Include((r) => r.RefereeS)
                .Include((r) => r.RefereeT)
                .Where(a => a.MatchStatus == "disable")
                .Select((a) => new {
                   mid = a.MId,
                    matchGroup = a.MatchGroup,
                    matchStatus = a.MatchStatus,
                    matchType = a.MatchType,
                    matchDate = a.MatchDate,
                    athleteRed = a.AthleteRedObj.AthleteName,
                    athleteBlue = a.AthleteBlueObj.AthleteName,
                    athleteRedImg = a.AthleteRedObj.ImageUrl,
                    athleteBlueImg = a.AthleteBlueObj.ImageUrl,
                    nextMatchId =  a.NextMatchId,
                    gender = a.Gender,
                    flag = a.Athleteflag.AthleteName,
                    categoryId = a.CategoryId,
                    category = a.Category.CategoryName,
                    matchCoordinator = a.Coordinator.Name,
                    referee1 = a.RefereeF.Name,
                    referee2 = a.RefereeS.Name,
                    referee3 = a.RefereeT.Name,
                    tournament = a.Tournament.TournamentName,

                }).ToListAsync();
        }

        // GET: api/Athletes/GetMatchById/5
        [HttpGet("GetMatchById/{id}")]
        public async Task<ActionResult<dynamic>> GetMatchById(int id)
        {
            var match = await _context.Matchss.Include((c) => c.Category)
                                              .Include((o) => o.AthleteRedObj)
                                              .Include((p)=> p.AthleteBlueObj)
                                              .Include((t) => t.Tournament)
                                              .Include((c) => c.Coordinator)
                                              .Include((r) => r.RefereeF)
                                              .Include((r) => r.RefereeS)
                                              .Include((r) => r.RefereeT)
                                              .Where(m => m.MId == id)
                                              .Select(m => new {
                                                  mid = m.MId,
                                                  matchStatus = m.MatchStatus,
                                                  matchType = m.MatchType,
                                                  matchDate = m.MatchDate,
                                                  athleteRedId = m.AthleteRed,
                                                  athleteRed = m.AthleteRedObj.AthleteName,
                                                  athleteBlueId = m.AthleteBlue,
                                                  athleteBlue = m.AthleteBlueObj.AthleteName,
                                                  athleteRedImg = m.AthleteRedObj.ImageUrl,
                                                  athleteBlueImg = m.AthleteBlueObj.ImageUrl,
                                                  coachRed = m.AthleteRedObj.Coach.CoachName,
                                                  coachBlue = m.AthleteBlueObj.Coach.CoachName,
                                                  redState = m.AthleteRedObj.State,
                                                  bluestate = m.AthleteBlueObj.State,
                                                  nextMatchId = m.NextMatchId,
                                                  flag = m.Flag,
                                                  categoryId = m.Category.CategoryName,
                                                  matchCoordinator = m.Coordinator.Name,
                                                  referee1 = m.RefereeF.Name,
                                                  referee2 = m.RefereeS.Name,
                                                  referee3 = m.RefereeT.Name,
                                                  tournamentId = m.Tournament.TournamentName,
                                              })
                                              .FirstOrDefaultAsync();
            if (match == null)
            {
                return NotFound(new { error = "Match Not Found" });
            }
            return match;
        }
// GET: api/Athletes/GetMatchById/5
        [HttpGet("GetMatchByMatchGroup/{MatchGroup}")]
        public async Task<ActionResult<dynamic>> GetMatchByMatchGroup(int MatchGroup)
        {
            var match = await _context.Matchss.Include((c) => c.Category)
                                              .Include((o) => o.AthleteRedObj)
                                              .Include((p)=> p.AthleteBlueObj)
                                              .Include((t) => t.Tournament)
                                              .Include((c) => c.Coordinator)
                                              .Include((r) => r.RefereeF)
                                              .Include((r) => r.RefereeS)
                                              .Include((r) => r.RefereeT)
                                              .Where(m => m.MatchGroup == MatchGroup)
                                              .Select(m => new {
                                                  mid = m.MId,
                                                  athleteRedId = m.AthleteRed,
                                                  athleteBlueId = m.AthleteBlue,
                                                  matchGroup = m.MatchGroup,
                                                  matchStatus = m.MatchStatus,
                                                  matchType = m.MatchType,
                                                  matchDate = m.MatchDate,
                                                  athleteRed = m.AthleteRedObj.AthleteName,
                                                  athleteBlue = m.AthleteBlueObj.AthleteName,
                                                  athleteRedImg = m.AthleteRedObj.ImageUrl,
                                                  athleteBlueImg = m.AthleteBlueObj.ImageUrl,
                                                  flag = m.Flag,
                                                  matchCoordinator = m.Coordinator.Name,
                                                  referee1 = m.RefereeF.Name,
                                                  referee2 = m.RefereeS.Name,
                                                  referee3 = m.RefereeT.Name,
                                                  tournamentId = m.Tournament.TournamentName,
                                                  categoryId = m.Category.CategoryName,
                                              })
                                              .FirstOrDefaultAsync();
            if (match == null)
            {
                return NotFound(new { error = "Match Not Found" });
            }
            return match;
        }

        [HttpPost("PostMatch")]
        public async Task<ActionResult<Matchs>> PostMatch(MatchVm matchs)
        {
            if (matchs == null)
            {
                return BadRequest(new { msg = "Please Enter All Details" });
            }

            // Validate other parameters as needed

            if (matchs.TournamentId != null)
            {
                // Check if either AthleteRed or AthleteBlue is already participating in another match
                var existingMatch = await _context.Matchss
                    .Where(m => m.MatchStatus != "Disable" && m.TournamentId == matchs.TournamentId) // Exclude Disable matches and match from different tournament
                    .FirstOrDefaultAsync(m => m.AthleteRed == matchs.AthleteRed || m.AthleteBlue == matchs.AthleteBlue);

                if (existingMatch != null)
                {
                    return BadRequest(new { msg = "One of the athletes is already participating in another match in the same tournament." });
                }
            }

            try
            {
                // Call the stored procedure
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC InsertMatchs @MatchStatus, @MatchType, @MatchDate,@Gender , @AthleteRed, @AthleteBlue, @CategoryId, @TournamentId",
                    parameters: new[]
                    {
                        new SqlParameter("@MatchStatus", "Upcoming"),
                        new SqlParameter("@MatchType", matchs.MatchType),
                        new SqlParameter("@MatchDate", matchs.MatchDate),
                        new SqlParameter("@Gender", matchs.Gender),
                        new SqlParameter("@AthleteRed", matchs.AthleteRed),
                        new SqlParameter("@AthleteBlue", matchs.AthleteBlue),
                        new SqlParameter("@CategoryId", matchs.CategoryId),
                        new SqlParameter("@TournamentId", matchs.TournamentId)
                    });

                return Ok(new { msg = "Successfully Added Match" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { msg = "An error occurred while processing the request.", error = ex.Message });
            }
        }

        [HttpGet("GetAssignMatch/{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetAssignMatch(int id)
        {

            // Fetch the ACR by ID
            var acr = await _context.Admin.FindAsync(id);
            if (acr == null)
            {
                _logger.LogWarning($"ACR with ID {id} not found");
                return NotFound("ACR not found");
            }

            // Fetch and include related entities and select specific properties
            var matches = await _context.Matchss
                .Include(c => c.Category)
                .Include(o => o.AthleteBlueObj)
                .Include(o => o.AthleteRedObj)
                .Include(t => t.Tournament)
                .Include(c => c.Coordinator)
                .Include(r => r.RefereeF)
                .Include(r => r.RefereeS)
                .Include(r => r.RefereeT)
                .Where(m => (m.MatchCoordinator == id || m.Referee1 == id || m.Referee2 == id || m.Referee3 == id) &&
                            (m.MatchStatus == "Live" || m.MatchStatus == "Upcoming") &&
                            m.MatchDate.HasValue &&
                            m.MatchDate.Value.Date == DateTime.UtcNow.Date)
                .Select(a => new
                {
                    mid = a.MId,
                    matchGroup = a.MatchGroup,
                    matchStatus = a.MatchStatus,
                    matchType = a.MatchType,
                    matchDate = a.MatchDate,
                    athleteRed = a.AthleteRedObj.AthleteName,
                    athleteBlue = a.AthleteBlueObj.AthleteName,
                    athleteRedImg = a.AthleteRedObj.ImageUrl,
                    athleteBlueImg = a.AthleteBlueObj.ImageUrl,
                    nextMatchId = a.NextMatchId,
                    gender = a.Gender,
                    flag = a.Flag,
                    category = a.Category.CategoryName,
                    matchCoordinator = a.Coordinator.Name,
                    referee1 = a.RefereeF.Name,
                    referee2 = a.RefereeS.Name,
                    referee3 = a.RefereeT.Name,
                    tournament = a.Tournament.TournamentName
                }).ToListAsync();

            if (!matches.Any())
            {
                return NotFound("No matching matches found");
            }

            return Ok(matches);
        }

        [HttpGet("today")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetTodayMatches()
        {
            try
            {
                var today = DateTime.UtcNow.Date;

                var matches = await _context.Matchss
                    .Include(c => c.Category)
                    .Include(o => o.AthleteBlueObj)
                    .Include(o => o.AthleteRedObj)
                    .Include(t => t.Tournament)
                    .Where(m => (m.MatchStatus == "Live" || m.MatchStatus == "Upcoming") &&
                                m.MatchDate.HasValue &&
                                m.MatchDate.Value.Date == today)
                    .Select(a => new
                    {
                        mid = a.MId,
                        matchGroup = a.MatchGroup,
                        matchDate = a.MatchDate,
                        athleteRed = a.AthleteRedObj.AthleteName,
                        athleteBlue = a.AthleteBlueObj.AthleteName,
                        athleteRedImg = a.AthleteRedObj.ImageUrl,
                        athleteBlueImg = a.AthleteBlueObj.ImageUrl,
                        Tournament = a.Tournament.TournamentName,
                        matchStatus = a.MatchStatus
                    })
                    .ToListAsync();

                if (!matches.Any())
                {
                    return NotFound(new { msg = "No matching matches found" });
                }

                return Ok(matches);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/Matches/AssignMatch/5
        [HttpPut("AssignMatch/{id}")]
        public async Task<IActionResult> AssignMatch(int id, MatchAssign matchAssignDTO)
        {
            var match = await _context.Matchss.FindAsync(id);

            if (match == null)
            {
                return NotFound(new { msg = "Match Not Found" });
            }
            var coordinatorName = await _context.Admin.FirstOrDefaultAsync(c => c.Name == matchAssignDTO.MatchCoordinator);
            var Referee1 = await _context.Admin.FirstOrDefaultAsync(c => c.Name == matchAssignDTO.Referee1);
            var Referee2 = await _context.Admin.FirstOrDefaultAsync(c => c.Name == matchAssignDTO.Referee2);
            var Referee3 = await _context.Admin.FirstOrDefaultAsync(c => c.Name == matchAssignDTO.Referee3);
            

            // Map the properties from the DTO to the match entity
            match.MatchCoordinator = coordinatorName.Id;
            match.Referee1 = Referee1.Id;
            match.Referee2 = Referee2.Id;
            match.Referee3 = Referee3.Id;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MatchExists(id))
                {
                    return NotFound(new { msg = "Match Not Found" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { msg = "Successfully Assigned Match" });
        }

        // PUT: api/Athletes/UpdateMatch/5
        [HttpPut("UpdateMatch/{Mid}")]
        public async Task<IActionResult> UpdateMatch(int Mid, MatchUp matchDTO)
        {
            // Find the match by ID
            var match = await _context.Matchss.FindAsync(Mid);

            if (match == null)
            {
                return NotFound();
            }

            // Check if MatchStatus is 'disable'
            if (match.MatchStatus == "Disable")
            {
                return BadRequest(new { msg = "Match is disabled and cannot be updated" });
            }

            // Update the match properties
            match.MatchStatus = matchDTO.MatchStatus;
            match.MatchType = matchDTO.MatchType;
            match.MatchDate = matchDTO.MatchDate;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MatchExists(Mid))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok(new { msg = "Successfully Updated Match" });
        }

        [HttpPut("UpdateNextMatchId/{id}")]
        public async Task<IActionResult> UpdateNextMatchId(int id, [FromBody] Matchs match)
        {
            if (id != match.MId)
            {
                return BadRequest(new { msg = "Match Not Found" });
            }

            var existingMatch = await _context.Matchss
            .Where(m => m.MId == id)
            .Select(m => m.MatchType)
            .FirstOrDefaultAsync();
            try
            {
                // Call the stored procedure directly through DbContext.Database.ExecuteSqlRawAsync
                await _context.Database.ExecuteSqlRawAsync("EXEC UpdateNextMatchId @Umid, @Flag, @MatchStatus, @MatchType, @ExistingMatchType",
                    new SqlParameter("@Umid",id),
                    new SqlParameter("@Flag", match.Flag),
                    new SqlParameter("@MatchStatus", match.MatchStatus),
                    new SqlParameter("@MatchType", match.MatchType),// Use provided MatchType
                    new SqlParameter("@ExistingMatchType", existingMatch)); 
                               
                // Exclude 'MId' column from the INSERT statement
                var modifiedMatch = new Matchs
                {
                    AthleteRed = match.AthleteRed,
                    AthleteBlue = match.AthleteBlue,
                    NextMatchId = match.NextMatchId,
                    CategoryId = match.CategoryId,
                    TournamentId = match.TournamentId,
                    MatchStatus = match.MatchStatus,
                    MatchDate = match.MatchDate,
                };

                return Ok(new { msg = "Successfully Ended Match"});
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MatchExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("GenerateOtp/{matchGroup}")]
        public async Task<IActionResult> GenerateOtp(int matchGroup)
        {
            if (!MatchExists(matchGroup))
            {
                return NotFound(new { msg = "Match group not found" });
            }

            var otp = await Generate6DigitOtpAsync();
            var expiration = DateTime.UtcNow.Add(_otpValidity);

            // Store OTP and match group in cache
            _cache.Set(otp, (matchGroup, expiration, 0), expiration);

            // Track the OTP key for cleanup
            _otpKeys.TryAdd(otp, true);

            // Optionally, start a background task to clean up expired OTPs
           await Task.Run(CleanUpExpiredOtps);

           return Ok(new { AccessKey = otp, MatchGroup = matchGroup });
        }

        [HttpPost("ValidateOtp")]
        public async Task<IActionResult> ValidateOtp([FromBody] ValidateOtpRequest request)
        {
            if (_cache.TryGetValue(request.Otp, out (int MatchGroup, DateTime Expiration, int AccessCount) otpInfo))
            {
                if (otpInfo.Expiration < DateTime.UtcNow)
                {
                    _cache.Remove(request.Otp);
                    _otpKeys.TryRemove(request.Otp, out _);
                    return BadRequest(new { msg = "Access Code expired" });
                }

                if (otpInfo.MatchGroup != request.MatchGroup)
                {
                    return BadRequest(new { msg = "Match group does not match" });
                }

                var match = _context.Matchss.FirstOrDefault(m => m.MatchGroup == otpInfo.MatchGroup);
                if (match == null)
                {
                    return NotFound(new { msg = "Match not found" });
                }

                bool isAuthorized = match.MatchCoordinator == request.RequestId ||
                                    match.Referee1 == request.RequestId ||
                                    match.Referee2 == request.RequestId ||
                                    match.Referee3 == request.RequestId;

                if (!isAuthorized)
                {
                    return Unauthorized(new { msg = "User is not authorized" });
                }

                if (otpInfo.AccessCount < 3)
                {
                    _cache.Set(request.Otp, (otpInfo.MatchGroup, otpInfo.Expiration, otpInfo.AccessCount + 1), otpInfo.Expiration);

                    return Ok(new { msg = "Access code validated successfully", id = request.RequestId });
                }
                else
                {
                    return BadRequest(new { msg = "Access code has already been accessed 3 times" });
                }
            }
            else
            {
                return NotFound(new { msg = "Access code not found" });
            }
        }

        // GET: api/Matches/GetStoredOtps (Debugging endpoint)
        [HttpGet("GetStoredOtps")]
        public IActionResult GetStoredOtps()
        {
            var otps = _otpKeys.Keys.ToList();
            var otpDetails = otps.Select(otp =>
            {
                if (_cache.TryGetValue(otp, out (int MatchGroup, DateTime Expiration, int AccessCount) otpInfo))
                {
                    return new { Otp = otp, MatchGroup = otpInfo.MatchGroup, Expiration = otpInfo.Expiration, AccessCount = otpInfo.AccessCount };
                }
                return null;
            }).Where(details => details != null).ToList();

            return Ok(otpDetails);
        }
        private Task<string> Generate6DigitOtpAsync()
        {
            return Task.Run(() =>
            {
                var random = new Random();
                var otp = random.Next(100000, 999999).ToString("D6");
                return otp;
            });
        }

        private void CleanUpExpiredOtps()
        {
            var now = DateTime.UtcNow;
            foreach (var otp in _otpKeys.Keys)
            {
                if (_cache.TryGetValue(otp, out (DateTime Expiration, int AccessCount) otpInfo) && otpInfo.Expiration < now)
                {
                    _cache.Remove(otp);
                    _otpKeys.TryRemove(otp, out _);
                }
            }
        }

        private bool MatchExists(int matchGroup)
        {
            return _context.Matchss.Any(e => e.MatchGroup == matchGroup);
        }

        public class ValidateOtpRequest
        {
            public string Otp { get; set; }
            public int MatchGroup { get; set; }

            public int RequestId { get; set; }
        }
    }
}
