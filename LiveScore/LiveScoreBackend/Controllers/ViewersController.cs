using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LiveScore.Data;
using LiveScore.Model;

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViewersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ViewersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Viewers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Viewers>>> GetViewerss()
        {
          if (_context.Viewerss == null)
          {
              return NotFound();
          }
            return await _context.Viewerss.ToListAsync();
        }

        // GET: api/Viewers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Viewers>> GetViewers(int id)
        {
          if (_context.Viewerss == null)
          {
              return NotFound();
          }
            var viewers = await _context.Viewerss.FindAsync(id);

            if (viewers == null)
            {
                return NotFound();
            }

            return viewers;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutViewers(int id, Viewers viewers)
        {
            if (id != viewers.VId)
            {
                return BadRequest(new {error = "Invalid Id"});
            }

            _context.Entry(viewers).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ViewersExists(id))
                {
                    return NotFound(new { error = "Viewers Not Found" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { msg = "Successfully Updated!!" });
        }

        [HttpPost]
        public async Task<ActionResult<Viewers>> PostViewers(Viewers viewers)
        {
          if (_context.Viewerss == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Viewerss'  is null.");
          }
            _context.Viewerss.Add(viewers);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetViewers", new { id = viewers.VId }, viewers);
        }

        // DELETE: api/Viewers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteViewers(int id)
        {
            if (_context.Viewerss == null)
            {
                return NotFound();
            }
            var viewers = await _context.Viewerss.FindAsync(id);
            if (viewers == null)
            {
                return NotFound();
            }

            _context.Viewerss.Remove(viewers);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ViewersExists(int id)
        {
            return (_context.Viewerss?.Any(e => e.VId == id)).GetValueOrDefault();
        }
    }
}
