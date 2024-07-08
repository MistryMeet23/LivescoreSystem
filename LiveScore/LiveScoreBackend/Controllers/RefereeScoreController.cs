using LiveScore.Data;
using LiveScore.Model.ViewModel;
using LiveScore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RefereeScoreController : ControllerBase
    {
        private readonly TempDbContext _tempDbContext;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly IHubContext<ScoreHub> _hubContext;


        public RefereeScoreController(TempDbContext tempDbContext, ApplicationDbContext applicationDbContext, IHubContext<ScoreHub> hubContext)
        {
            _tempDbContext = tempDbContext;
            _applicationDbContext = applicationDbContext;
            _hubContext = hubContext;

        }

        [HttpPost("CreateRefScore/{refid}/{matchGroup}")]
        public async Task<IActionResult> CreateRefScore(RefScore refScore, int refid, int matchGroup)
        {
            if (refScore == null)
            {
                return BadRequest();
            }

            refScore.RefereeId = refid;  // Set RefereeId to the provided refid

            _tempDbContext.RefScores.Add(refScore);
            await _tempDbContext.SaveChangesAsync();

            await _hubContext.Clients.Group(matchGroup.ToString()).SendAsync("ReceiveLastRefScore", refScore);


            return Ok(new { msg = "Score is Added", res = refScore });
        }

        
        [HttpGet("last")]
        public async Task<IActionResult> GetLastRefScore(int matchGroup)
        {
            var lastRefScore = await _tempDbContext.RefScores
                .OrderByDescending(r => r.Id)
                .FirstOrDefaultAsync();

            if (lastRefScore == null)
            {
                return NotFound();
            }

            var referee = await _applicationDbContext.Admin.FindAsync(lastRefScore.RefereeId);
            var result = new
            {
                lastRefScore.Id,
                lastRefScore.RedPoints,
                lastRefScore.BluePoints,
                lastRefScore.RedPenalty,
                lastRefScore.BluePenalty,
                RefereeName = referee?.Name
            };
            await _hubContext.Clients.Group(matchGroup.ToString()).SendAsync("ReceiveLastRefScore", result);

            return Ok(result);
        }

        [HttpGet("GetAllRefScores")]
        public async Task<IActionResult> GetAllRefScores()
        {
            var refScores = await _tempDbContext.RefScores
                .ToListAsync();

            var results = new List<object>();

            foreach (var refScore in refScores)
            {
                var referee = await _applicationDbContext.Admin.FindAsync(refScore.RefereeId);
                var result = new
                {
                    refScore.Id,
                    refScore.RedPoints,
                    refScore.BluePoints,
                    refScore.RedPenalty,
                    refScore.BluePenalty,
                    RefereeName = referee?.Name
                };
                results.Add(result);
            }

            return Ok(results);
        }
    }
}
