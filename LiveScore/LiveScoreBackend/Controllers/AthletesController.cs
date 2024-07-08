
using CloudinaryDotNet.Actions;
using LiveScore.Data;
using LiveScore.Model;
using LiveScore.Model.ViewModel;
using LiveScore.Services;
//using LiveScore.Model.ViewModel;
using LiveScoring.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Macs;

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AthletesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;
        private readonly IImageUploader _imageUploader;

        public AthletesController(ApplicationDbContext context, IEmailSender emailSender,IImageUploader imageUploader)
        {
            _context = context;
            _emailSender = emailSender;
            _imageUploader = imageUploader;
        }

        // GET: api/Athletes
        [HttpGet("getAthelete")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetAthletes()
        {
            if (_context.Athletes == null)
            {
                return NotFound(new { msg = "Athelete Not Found" });
            }
            return await _context.Athletes
                .Include((e)=> e.Coach)
                .Include((c) => c.Category)
                .Include((o)=> o.acr)
                .Select((a)=> new {
                    id = a.Id,
                    athleteName = a.AthleteName,
                    email = a.Email,
                    contact = a.Contact,
                    imageUrl = a.ImageUrl,
                    dateOfBirth = a.DateOfBirth,
                    age = a.Age,
                    gender = a.Gender,
                    city = a.City,
                    state = a.State,
                    status = a.Status,
                    coachName = a.Coach.CoachName,
                    categoryName = a.Category.CategoryName,
                    coordinator = a.acr.Name,
                }).ToListAsync();
        }

        //// GET: api/Athletes/5
        [HttpGet("GetAthelete/{id}")]
        public async Task<ActionResult<dynamic>> GetAthlete(int id)
        {
            var athlete = await _context.Athletes.Include((e) => e.Coach).Include((c) => c.Category).Include((o) => o.acr)
                .Where(a => a.Id == id)
                .Select(a => new {
                    id = a.Id,
                    athleteName = a.AthleteName,
                    email = a.Email,
                    contact = a.Contact,
                    imageUrl = a.ImageUrl,
                    dateOfBirth = a.DateOfBirth,
                    age = a.Age,
                    height = a.Height,
                    weight = a.Weight,
                    gender = a.Gender,
                    city = a.City,
                    state = a.State,
                    coachName = a.Coach.CoachName,
                    categoryName = a.Category.CategoryName,                   
                    coordinater = a.acr.Name,
                    
                })
                .FirstOrDefaultAsync();

            if (athlete == null)
            {
                return NotFound();
            }

            return athlete;
        }

        [HttpGet("GetAthleteByCatAndGen/{categoryId}/{gender}")]
        public async Task<ActionResult<IEnumerable<Athlete>>> GetAthleteByCatAndGen(int categoryId, string gender)
        {
            // Fetch athletes by category and gender
            var athletes = await _context.Athletes
                .Where(a => a.CategoryId == categoryId && a.Gender == gender)
                .ToListAsync();

            if (athletes == null || athletes.Count == 0)
            {
                return NotFound(); // Return 404 if no athletes are found
            }

            return athletes; // Return the fetched athletes
        }

        [HttpPut("UpdateAthlete/{id}")]
        public async Task<IActionResult> UpdateAthlete(int id,UpAthelete athleteDto)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null)
            {
                return NotFound(new { msg = "Athlete not found" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coach = await _context.Coaches.FirstOrDefaultAsync(c => c.CoachName == athleteDto.CoachName);
            //var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryName == athleteDto.CategoryName);

            // Update athlete properties
            athlete.AthleteName = athleteDto.AthleteName;
            athlete.Email = athleteDto.Email;
            athlete.Contact = athleteDto.Contact;
            athlete.DateOfBirth = athleteDto.DateOfBirth;
            athlete.Gender = athleteDto.Gender;
            athlete.Height = athleteDto.Height;
            athlete.Weight = athleteDto.Weight;
            athlete.City = athleteDto.City;
            athlete.State = athleteDto.State;
            athlete.CoachId = coach.CoachId;

            // Calculate age based on DateOfBirth
            var age = DateTime.Now.Year - athlete.DateOfBirth.Year;
            if (DateTime.Now.Month < athlete.DateOfBirth.Month ||
                (DateTime.Now.Month == athlete.DateOfBirth.Month && DateTime.Now.Day < athlete.DateOfBirth.Day))
            {
                age--;
            }

            // Validate age
            var ageCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.MinAge <= age && c.MaxAge >= age);
            if (ageCategory == null)
            {
                return BadRequest(new { msg = "No suitable category found for the athlete based on age" });
            }

            // Validate weight
            var weightCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.MinWeight <= athlete.Weight && c.MaxWeight >= athlete.Weight);
            if (weightCategory == null)
            {
                return BadRequest(new { msg = "No suitable category found for the athlete based on weight" });
            }

            // Find the appropriate category based on age and weight
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.MinAge <= age && c.MaxAge >= age &&
                                          c.MinWeight <= athlete.Weight && c.MaxWeight >= athlete.Weight 
                                          //&& c.Gender == athlete.Gender
                                          );
            if (category == null)
            {
                return BadRequest(new { msg = "No suitable category found for the athlete" });
            }
            athlete.CategoryId = category.Id;


            // string messageBody = "<!DOCTYPE html>" +
            //                       "<html>" +
            //                       "<head>" +
            //                       "<title>Welcome to Live Score!</title>" +
            //                       "</head>" +
            //"<body>" +
            //                      $" <h2>Respected  {athlete.AthleteName},</h2>" +
            //                       "<p>Congratulations on joining Live Score! You're now registered as a coordinator. Get ready to manage live score updates and ensure seamless sports experiences for our users.</p>" +
            //                       "<p>Explore our platform tools to optimize your coordination tasks. For assistance, our support team is here to help.</p>" +
            //                       "<p>Welcome aboard!</p>" +
            //                       "<p>Best regards,<br />" +
            //                       " Live Score</p>" +
            //                       "</body>" +
            //                       "</html>";

            // _emailSender.SendEmail(athlete.Email, "SucessFully Registered", messageBody);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { msg = "Athlete information successfully updated" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AthleteExists(id))
                {
                    return NotFound(new { msg = "Athlete Not Found" });
                }
                else
                {
                    throw;
                }
            }
        }

        [HttpPut("UpdateAthleteImage/{id}")]
        public async Task<IActionResult> UpdateAthleteImage(int id, [FromForm] UpdateImg updateImg)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null)
            {
                return NotFound(new { msg = "Athlete not found" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (updateImg.ImageFile != null)
            {
                // Delete existing image if it exists
                if (!string.IsNullOrEmpty(athlete.ImageUrl))
                {
                    // Delete existing image file
                    _imageUploader.DeleteImage(athlete.ImageUrl, "images");
                }

                // Upload and update new image
                string imageUrl = await _imageUploader.UploadImg(updateImg.ImageFile, "images");
                athlete.ImageUrl = imageUrl;

                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new { msg = "Athlete image successfully updated" });
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AthleteExists(id))
                    {
                        return NotFound(new { msg = "Athlete Not Found" });
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return BadRequest(new { msg = "Image file is missing" });

        }


        // POST: api/Athletes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("PostAthlete")]
        public async Task<ActionResult<Athlete>> PostAthlete([FromForm] Images athleteDto)
        {
           
            if (athleteDto == null)
            {
                return BadRequest("Invalid athlete data");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            string imageUrl = await _imageUploader.UploadImg(athleteDto.ImageFile, "images");
            // Calculate age based on DateOfBirth
            var age = DateTime.Now.Year - athleteDto.DateOfBirth.Year;
            if (DateTime.Now.Month < athleteDto.DateOfBirth.Month ||
                (DateTime.Now.Month == athleteDto.DateOfBirth.Month && DateTime.Now.Day < athleteDto.DateOfBirth.Day))
            {
                age--;
            }

            // Validate age
            var ageCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.MinAge <= age && c.MaxAge >= age);
            if (ageCategory == null)
            {
                return BadRequest(new { msg = "No suitable category found for the athlete based on age" });
            }

            // Validate weight
            var weightCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.MinWeight <= athleteDto.Weight && c.MaxWeight >= athleteDto.Weight);
            if (weightCategory == null)
            {
                return BadRequest(new { msg = "No suitable category found for the athlete based on weight" });
            }

            // Find the appropriate category based on age and weight
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.MinAge <= age && c.MaxAge >= age &&
                                          c.MinWeight <= athleteDto.Weight && c.MaxWeight >= athleteDto.Weight 
                                          //&& c.Gender == athleteDto.Gender
                                          );
            if (category == null)
            {
                return BadRequest(new { msg = "No suitable category found for the athlete" });
            }

            var athlete = new Athlete
            {
                AthleteName = athleteDto.AthleteName,
                Email = athleteDto.Email,
                Contact = athleteDto.Contact,
                DateOfBirth = athleteDto.DateOfBirth,
                Gender = athleteDto.Gender,
                Height = athleteDto.Height,
                Weight = athleteDto.Weight,
                City = athleteDto.City,
                State = athleteDto.State,
                CategoryId = category.Id,
                CoachId = athleteDto.CoachId,
                Coordinater = athleteDto.CoordinatorId,
                ImageUrl = imageUrl
            };

            _context.Athletes.Add(athlete);
            await _context.SaveChangesAsync();

            //string messageBody = "<!DOCTYPE html>" +
            //                       "<html>" +
            //                       "<head>" +
            //                       "<title>Welcome to Live Score!</title>" +
            //                       "</head>" +
            //"<body>" +
            //                      $" <h2>Respected  {athlete.AthleteName},</h2>" +
            //                       "<p>Congratulations on joining Live Score! You're now registered as a coordinator. Get ready to manage live score updates and ensure seamless sports experiences for our users.</p>" +
            //                       "<p>Explore our platform tools to optimize your coordination tasks. For assistance, our support team is here to help.</p>" +
            //                       "<p>Welcome aboard!</p>" +
            //                       "<p>Best regards,<br />" +
            //                       " Live Score</p>" +
            //                       "</body>" +
            //                       "</html>";

            //_emailSender.SendEmail(athlete.Email, "SuccessFully Registered", messageBody);

            return Ok(new { msg = "Athlete created successfully." });

        }
        

        [HttpPost("BlockAthlete/{id}")]
        public async Task<ActionResult<Athlete>> BlockAthlete(int id)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null)
            {
                return NotFound(new {msg = "Athlete Not Found"});
            }

            if(athlete.Status == "UnBlock")
            {
                athlete.Status = "Block";
                await _context.SaveChangesAsync();
                return Ok(new { msg = "Athlete Is Successfully Blocked" });
            }
            if(athlete.Status == "Block")
            {
                athlete.Status = "UnBlock";
                await _context.SaveChangesAsync();
                return Ok(new { msg = "Athlete Is Successfully UnBlocked" });
            }
            return Ok("Successful");
        }

        [HttpPost("Retired/{id}")]
        public async Task<ActionResult<Athlete>> RetiredAthlete(int id)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null)
            {
                return NotFound(new {msg = "Athlete Not Found"});
            }

            if(athlete.Status == "UnBlock" && athlete.Status == "Block")
            {
                athlete.Status = "Retired";
                await _context.SaveChangesAsync();
                return Ok(new { msg = "Athlete is Retired" });
            }
           
            return Ok("Successful");
        }

        private bool AthleteExists(int id)
        {
            return (_context.Athletes?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
