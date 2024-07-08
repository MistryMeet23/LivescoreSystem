using LiveScore.Data;
using LiveScore.Model.ViewModel;
using LiveScoring.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TournamentsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public TournamentsController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("GetTournaments")]
       public async Task<ActionResult<IEnumerable<dynamic>>> GetTournaments()
        {
           if (_dbContext.Tournaments == null)
           {
                return NotFound(new { error = "Tournament Not Found" });
            }
            return await _dbContext.Tournaments
                .Include((c) => c.Coordinator)
                .Select((a) => new
                {
                    TId = a.TId,
                    TournamentName = a.TournamentName,
                    Venue = a.Venue,
                    TournamentDate = a.TournamentDate,
                    TournamentCoordinator =a.Coordinator.Name

                })
                .ToListAsync();
        }
      

        [HttpGet("GetTournamentById/{id}")]
        public async Task<ActionResult<dynamic>> GetTournament(int id)
        {
            if(_dbContext.Tournaments == null)
            {
                return NotFound(new {error = "Tournamnet Not Found"});
            }

            var tournament = await _dbContext.Tournaments
                .Include((c) => c.Coordinator)
                .Where((a) => a.TId == id)
                .Select((a) => new
                {
                    tournamentName = a.TournamentName,
                    venue = a.Venue,
                    tournamentDate = a.TournamentDate,
                    coordinatorName = a.Coordinator.Name

                }).FirstOrDefaultAsync();

            if (tournament == null)
            {
                return NotFound(new { error = "Tournamnet Not Found" });
            }
            return tournament;
        }

        [HttpPost("PostTournament")]
        public async Task<ActionResult<Tournament>> PostTournament(Tournament tournament)
        {
            if (tournament == null)
            {
                return BadRequest(new {error = "Please Enter All Field"});
            }

            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_dbContext.Tournaments == null)
            {
                return BadRequest(new { msg = "Something Went Wrong"});
            }

            _dbContext.Tournaments.Add(tournament);
             await _dbContext.SaveChangesAsync();

            return Ok(new { msg = "Successfully Added Tournament"});
        }

        [HttpPut("PutTournament/{id}")]
        public async Task<IActionResult> PutTournament(int id,TournamentVM tournamentvm)
        {
            var tournament = await _dbContext.Tournaments.FindAsync(id);
            if(id != tournament.TId)
            {
                return BadRequest(new { error = "Id Didn't Match" });
            }

            var coordinatorName = await _dbContext.Admin.FirstOrDefaultAsync(c => c.Name == tournamentvm.CoordinatorName);

            //update properties
            tournament.TournamentName = tournamentvm.TournamentName;
            tournament.Venue = tournamentvm.Venue;
            tournament.TournamentDate = tournamentvm.TournamentDate;
            tournament.TournamentCoordinator = coordinatorName.Id;

            try
            {
                await _dbContext.SaveChangesAsync();
            }catch (DbUpdateConcurrencyException) {
                if (!TournamentExists(id))
                {
                    return NotFound(new { error = "Tournament Not Found" });
                }
                else
                {
                    throw;
                }
            }
            return Ok(new { msg = "Successfully Updated...." });
        }

        private bool TournamentExists(int id)
        {
            return (_dbContext.Tournaments?.Any(e => e.TId == id)).GetValueOrDefault();
        }
    }
}
