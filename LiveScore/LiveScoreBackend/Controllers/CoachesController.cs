using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LiveScore.Data;
using LiveScore.Model;
using LiveScore.Model.ViewModel;
using LiveScore.Services;
using LiveScoring.Model;

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoachesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IImageUploader _imageUploader;


        public CoachesController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment, IEmailSender emailSender, IImageUploader uploadImage)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _emailSender = emailSender;
            _imageUploader = uploadImage;
        }

        // GET: api/Coaches
        [HttpGet("GetCoaches")]
        public async Task<ActionResult<IEnumerable<Coach>>> GetCoaches()
        {
          if (_context.Coaches == null)
          {
              return NotFound(new { msg = "Coaches Not Found" });
          }
            return await _context.Coaches.ToListAsync();
        }

        // GET: api/Coaches/5
        [HttpGet("GetCoachesById/{id}")]
        public async Task<ActionResult<Coach>> GetCoach(int id)
        {
          if (_context.Coaches == null)
          {
              return NotFound(new { msg = "Coaches Not Found" });
          }
            var coach = await _context.Coaches.FindAsync(id);

            if (coach == null)
            {
                return NotFound(new { msg = "Coaches Not Found" });
            }

            return coach;
        }

        //Put
        [HttpPut("UpdateCoach/{id}")]
        public async Task<IActionResult> UpdateCoach(int id, Coach coachDto)
        {
            var coach = await _context.Coaches.FindAsync(id);
             if (!CoachExists(id))
                {
                    return NotFound(new { msg = "Coach Id Not Found" });
                }
            if (coach == null)
            {
                return NotFound(new { msg = "Coach not found" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new {msg = "Please fill All Field"});
            }

            // Update coach properties
            coach.CoachName = coachDto.CoachName;
            coach.CoachEmail = coachDto.CoachEmail;
            coach.Achievements = coachDto.Achievements;
            coach.Experience = coachDto.Experience;
            coach.ContactNo = coachDto.ContactNo;
            coach.Gender = coachDto.Gender;
            string messageBody = "<!DOCTYPE html>" +
                                 "<html>" +
                                 "<head>" +
                                 "<title>Welcome to Live Score!</title>" +
                                 "</head>" +
                                "<body>" +
                                $" <h2>Respected {coach.CoachName},</h2>" +
                                "< p > Congratulations on your recent update at Live Score! You're now on board as a Coach. Get ready to manage live score updates and ensure seamless sports experiences for our users.</p>" +
                                "< p > Explore our platform tools to optimize your coordination tasks. For assistance, our support team is here to help.</ p >" +
                                "< p > Welcome aboard! </ p >" +
                                "< p > Best regards,< br />" +
                                "Live Score </ p >" +
                                 "</body>" +
                                   "</html>";

            _emailSender.SendEmail(coach.CoachEmail, "Sucessfully Updated", messageBody);


            //try
            //{
                await _context.SaveChangesAsync();
                return Ok(new { msg = "Coach information successfully updated" });
            //}
            //catch (DbUpdateConcurrencyException)
            //{
               
            //    else
            //    {
            //        throw;
            //    }
            //}
        }

        [HttpPut("UpdateCoachImage/{id}")]
        public async Task<IActionResult> UpdateCoachImage(int id, [FromForm] UpdateImg updateImg)
        {
            var coach = await _context.Coaches.FindAsync(id);
            if (coach == null)
            {
                return NotFound(new { error = "Coach not found" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (updateImg.ImageFile != null)
            {
                // Delete existing image if it exists
                if (!string.IsNullOrEmpty(coach.ImageUrl))
                {
                    // Delete existing image file
                    _imageUploader.DeleteImage(coach.ImageUrl, "coach");
                }

                // Upload and update new image
                string imageUrl = await _imageUploader.UploadImg(updateImg.ImageFile, "coach");
                coach.ImageUrl = imageUrl;

                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new { msg = "Coach image successfully updated" });
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CoachExists(id))
                    {
                        return NotFound(new { error = "Coach  Not Found" });
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return BadRequest(new { msg = "Image file is missing" });
        }

       
        // POST: api/Coaches
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("PostCoach")]
        public async Task<ActionResult<Coach>> PostCoach([FromForm]ImageCoach coachimg)
        {
          if (_context.Coaches == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Coaches'  is null.");
          }

            string imageUrl = await _imageUploader.UploadImg(coachimg.ImageFile, "coach");

            var coach = new Coach
            {
                CoachName = coachimg.CoachName,
                CoachEmail = coachimg.CoachEmail,
                Achievements = coachimg.Achievements,
                Experience = coachimg.Experience,
                ContactNo = coachimg.ContactNo,
                Gender = coachimg.Gender,
                Status = "UnBlock",
                ImageUrl = imageUrl,
            };

            _context.Coaches.Add(coach);
            await _context.SaveChangesAsync();
            string messageBody = "<!DOCTYPE html>" +
                                  "<html>" +
                                  "<head>" +
                                  "<title>Welcome to Live Score!</title>" +
                                  "</head>" +
            "<body>" +
                                 $" <h2>Respected  {coach.CoachName},</h2>" +
                                  "<p>Congratulations on joining Live Score! You're now registered as a Coach. Get ready to manage live score updates and ensure seamless sports experiences for our users.</p>" +
                                  "<p>Explore our platform tools to optimize your coordination tasks. For assistance, our support team is here to help.</p>" +
                                  "<p>Welcome aboard!</p>" +
                                  "<p>Best regards,<br />" +
                                  " Live Score</p>" +
                                  "</body>" +
            "</html>";

            _emailSender.SendEmail(coach.CoachEmail, "SucessFully Registered", messageBody);

            return Ok(new { msg = "Successfully Added Coach"});
        }


        // Method to delete image file
        //private void DeleteImage(string imageUrl)
        //{
        //    var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, , Path.GetFileName(imageUrl));
        //    if (System.IO.File.Exists(imagePath))
        //    {
        //        System.IO.File.Delete(imagePath);
        //    }
        //}


        [HttpPost("BlockCoach/{id}")]
        public async Task<ActionResult<Coach>> BloackCoach(int id)
        {
            var coach = await _context.Coaches.FindAsync(id);
            if (coach == null)
            {
                return NotFound(new { msg = "Coach Not Found" });
            }

            if (coach.Status == "UnBlock")
            {
                coach.Status = "Block";
                await _context.SaveChangesAsync();
                return Ok(new { msg = "coach Is Successfully Blocked" });
            }
            if (coach.Status == "Block")
            {
                coach.Status = "UnBlock";
                await _context.SaveChangesAsync();
                return Ok(new { msg = "Coach Is Successfully UnBlocked" });
            }
            return Ok("Successful");
        }

        // DELETE: api/Coaches/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoach(int id)
        {
            if (_context.Coaches == null)
            {
                return NotFound();
            }
            var coach = await _context.Coaches.FindAsync(id);
            if (coach == null)
            {
                return NotFound();
            }

            _context.Coaches.Remove(coach);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CoachExists(int id)
        {
            return (_context.Coaches?.Any(e => e.CoachId == id)).GetValueOrDefault();
        }
    }
}
