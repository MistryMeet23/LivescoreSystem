using CloudinaryDotNet.Actions;
using LiveScore.Data;
using LiveScore.Model;
using LiveScore.Model.ViewModel;
using LiveScore.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Data;
using System.Xml.Linq;

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ACRController : ControllerBase
    {
        private readonly ApplicationDbContext _dbcontext;
        private readonly ILogger<ACR> _logger;
        private readonly PasswordService _pservice;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IEmailSender _emailSender;
        private readonly IImageUploader _imageUploader;
        public ACRController(ApplicationDbContext dbContext, ILogger<ACR> logger, PasswordService pservice, IWebHostEnvironment webHostEnvironment, IEmailSender emailSender, IImageUploader imageUploader)
        {
            _dbcontext = dbContext;
            _logger = logger;
            _pservice = pservice;
            _webHostEnvironment = webHostEnvironment;
            _emailSender = emailSender;
            _imageUploader = imageUploader;
        }

        [HttpGet("GetACR")]
        public async Task<ActionResult<IEnumerable<ACR>>> GetAllACR()
        {
            var acrs = await _dbcontext.Admin.ToListAsync();
            return acrs;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ACR>> GetACR(int id)
        {
            var acr = await _dbcontext.Admin.FindAsync(id);
            if (acr == null)
            {
                _logger.LogWarning($"ACR with ID {id} not found");
                return NotFound();
            }
            return Ok(acr);
        }

        //Super Admin Section

        //Adding Super Admin
        [HttpPost("AddSAdmin")]
        public async Task<ActionResult<ACR>> PostSAdmin(ACR acr)
        {

            if (string.IsNullOrEmpty(acr.Password))
            {
                return BadRequest(new { msg = "Please Enter all Field" });
            }

            // Check if the email already exists in the database
            if (_dbcontext.Admin.Any(a => a.Email == acr.Email))
            {
                return BadRequest(new { msg = "Email already exists" });
            }
            //checked if the contact already exists in the database
            if (_dbcontext.Admin.Any(a => a.Contact == acr.Contact))
            {
                return BadRequest(new { msg = "Contact already exists" });
            }
            acr.RoleId = 1; // Set to the appropriate RoleId value
            acr.Password = _pservice.HashPassword(acr.Password);
            _dbcontext.Admin.Add(acr);
            await _dbcontext.SaveChangesAsync();
            acr.Password = null;

            return Ok(new { msg = "Successfully Added Super Admin" });

        }

        //Updating Super Coordinator

        [HttpPut("updateSAdmin")]
        public async Task<ActionResult<ACR>> UpdateSAdmin(ACR acr)
        {
            if (acr == null || acr.Id == 0)
            {
                return BadRequest(new { msg = "Please Enter All Field" });
            }

            var uacr = await _dbcontext.Admin.FindAsync(acr.Id);
            if (uacr == null)
            {
                return NotFound(new { msg = "Super Admin Not Found" });
            }

            // Check if the new email already exists
            if (await _dbcontext.Admin.AnyAsync(a => a.Id != acr.Id && a.Email == acr.Email))
            {
                return BadRequest(new { msg = "Email already exists for another Super Admin." });
            }

            // Check if the new contact already exists
            if (await _dbcontext.Admin.AnyAsync(a => a.Id != acr.Id && a.Contact == acr.Contact))
            {
                return BadRequest(new { msg = "Contact already exists for another Super Admin." });
            }
            acr.RoleId = 1;
            acr.Password = _pservice.HashPassword(acr.Password);

            uacr.Email = acr.Email;
            uacr.Name = acr.Name;
            uacr.Password = acr.Password;
            uacr.ImageURL = acr.ImageURL;
            uacr.Contact = acr.Contact;
            uacr.DateOfBirth = acr.DateOfBirth;
            uacr.LastLogin = acr.LastLogin;
            uacr.Status = "Verified";
            uacr.Gender = acr.Gender;
            uacr.City = acr.City;
            uacr.State = acr.State;
            uacr.RoleId = acr.RoleId;
            await _dbcontext.SaveChangesAsync();

            return Ok(new { msg = "Successfully Updated Super Admin" });
        }

        //Admin Section

        //Adding Admin
        [HttpPost("AddAdmin")]
        public async Task<ActionResult<ACR>> PostAdmin(ACR acr)
        {
            if (string.IsNullOrEmpty(acr.Password))
            {
                return BadRequest(new { msg = "Please Enter all Field" });
            }

            // Check if the email already exists in the database
            if (_dbcontext.Admin.Any(a => a.Email == acr.Email))
            {
                return BadRequest(new { msg = "Email already exists" });
            }

            //checked if the contact already exists in the database
            if (_dbcontext.Admin.Any(a => a.Contact == acr.Contact))
            {
                return BadRequest(new { msg = "Contact already exists" });
            }

            acr.RoleId = 2;
            acr.Status = "Verified";// Set to the appropriate RoleId value
            acr.Password = _pservice.HashPassword(acr.Password);
            _dbcontext.Admin.Add(acr);
            await _dbcontext.SaveChangesAsync();
            acr.Password = null;

            //for message body
            //string messageBody = "<!DOCTYPE html>" +
            //                        "<html>" +
            //                        "<head>" +
            //                        "<title>Welcome to Live Score!</title>" +
            //                        "</head>" +
            //                        "<body>" +
            //                       $" <h2>Respected  {acr.Name},</h2>" +
            //                        "<p>Congratulations on joining Live Score! You're now registered as a coordinator. Get ready to manage live score updates and ensure seamless sports experiences for our users.</p>" +
            //                        "<p>Explore our platform tools to optimize your coordination tasks. For assistance, our support team is here to help.</p>" +
            //                        "<p>Welcome aboard!</p>" +
            //                        "<p>Best regards,<br />" +
            //                        " Live Score</p>" +
            //                        "</body>" +
            //                        "</html>";

            //_emailSender.SendEmail(acr.Email, "SucessFully Registered", messageBody);
            return Ok(new { msg = "Successfully Added Admin" });
        }

        //Updating Admin

        [HttpPut("updateAdmin")]
        public async Task<ActionResult<ACR>> UpdateAdmin(ACR acr)
        {
            if (acr == null || acr.Id == 0)
            {
                return BadRequest(new { msg = "Please Enter All Field" });
            }

            var uacr = await _dbcontext.Admin.FindAsync(acr.Id);
            if (uacr == null)
            {
                return NotFound(new { msg = "Admin Not Found" });
            }

            // Check if the new email already exists
            if (await _dbcontext.Admin.AnyAsync(a => a.Id != acr.Id && a.Email == acr.Email))
            {
                return BadRequest(new { msg = "Email already exists for another Admin." });
            }

            // Check if the new contact already exists
            if (await _dbcontext.Admin.AnyAsync(a => a.Id != acr.Id && a.Contact == acr.Contact))
            {
                return BadRequest(new { msg = "Contact already exists for another Admin." });
            }
            acr.RoleId = 2;
            acr.Password = _pservice.HashPassword(acr.Password);

            uacr.Email = acr.Email;
            uacr.Name = acr.Name;
            uacr.Password = acr.Password;
            uacr.ImageURL = acr.ImageURL;
            uacr.Contact = acr.Contact;
            uacr.DateOfBirth = acr.DateOfBirth;
            uacr.Status = "Verified";
            uacr.LastLogin = acr.LastLogin;
            uacr.Gender = acr.Gender;
            uacr.City = acr.City;
            uacr.State = acr.State;
            uacr.RoleId = acr.RoleId;
            await _dbcontext.SaveChangesAsync();


            return Ok(new { msg = "Successfully Updated Admin" }); 
        }

        //Coordinator Section
        [HttpGet("Coordinator")]
        public async Task<ActionResult<ACR>> GetCoordinator()
        {
            // Assuming role ID 3 corresponds to the coordinator role
            int coordinatorRoleId = 3;

            // Fetch the coordinator from ACR table with the specified ID and role ID 3
            var coordinator = await _dbcontext.Admin.Where(acr => acr.RoleId == coordinatorRoleId).ToListAsync();

            if (coordinator == null)
            {
                _logger.LogWarning($"Coordinator with ID not found");
                return NotFound();
            }
            return Ok(coordinator);
        }

        [HttpPost("VerifyCoordinator/{id}")]
        public async Task<ActionResult<ACR>> VerifyCoordinator(int id)
        {
            var coordinator = await _dbcontext.Admin.FindAsync(id);
            if (coordinator == null) { return NotFound(new { msg = "Coordinator not found" }); }

            if (coordinator.Status == "Not Verified")
            {
                coordinator.Status = "Verified";
                await _dbcontext.SaveChangesAsync();
                return Ok(new { msg = "Successfully Verify Coordinator" });
            }
            if (coordinator.Status == "Verified")
            {
                coordinator.Status = "Block";
                await _dbcontext.SaveChangesAsync();
                return Ok(new { msg = "Successfully Block Coordinator" });
            }
            if (coordinator.Status == "Block")
            {
                coordinator.Status = "Verified";
                await _dbcontext.SaveChangesAsync();
                return Ok(new { msg = "Successfully Unblock Coordinator" });
            }
            return Ok("Successful");
        }

        //Adding Coordinator
        [HttpPost("AddCoordinator")]
        public async Task<ActionResult<ACR>> PostCoordinator([FromForm] Imageacr acrimg)
        {
            if (string.IsNullOrEmpty(acrimg.Password))
            {
                return BadRequest(new { msg = "Please Enter all Field" });
            }

            // Check if the email already exists in the database
            if (_dbcontext.Admin.Any(a => a.Email == acrimg.Email))
            {
                return BadRequest(new { msg = "Email already exists" });
            }

            //checked if the contact already exists in the database
            if (_dbcontext.Admin.Any(a => a.Contact == acrimg.Contact))
            {
                return BadRequest(new { msg = "Contact already exists" });
            }
            string imageUrl = await _imageUploader.UploadImg(acrimg.ImageFile, "ACR");

            var acr = new ACR
            {
                Email = acrimg.Email,
                Name = acrimg.Name,
                Password = acrimg.Password,
                Contact = acrimg.Contact,
                DateOfBirth = acrimg.DateOfBirth,
                Gender = acrimg.Gender,
                City = acrimg.City,
                State = acrimg.State,
                ImageURL = imageUrl
            };

            acr.RoleId = 3;
            acr.Status = "Not Verified";
            acr.Password = _pservice.HashPassword(acr.Password);
            _dbcontext.Admin.Add(acr);
            await _dbcontext.SaveChangesAsync();
            acr.Password = null;

            //for message body
            string messageBody = "<!DOCTYPE html>" +
                                    "<html>" +
                                    "<head>" +
                                    "<title>Welcome to Live Score!</title>" +
                                    "</head>" +
                                    "<body>" +
                                   $" <h2>Respected  {acr.Name},</h2>" +
                                    "<p>Congratulations on joining Live Score! You're now registered as a coordinator. Get ready to manage live score updates and ensure seamless sports experiences for our users.</p>" +
                                    "<p>Explore our platform tools to optimize your coordination tasks. For assistance, our support team is here to help.</p>" +
                                    "<p>Welcome aboard!</p>" +
                                    "<p>Best regards,<br />" +
                                    " Live Score</p>" +
                                    "</body>" +
                                    "</html>";

            _emailSender.SendEmail(acr.Email, "SucessFully Registered", messageBody);

            return Ok(new { msg = "Successfully Added  Coordinator" });
        }

        [HttpPut("updateCoordinator/{id}")]
        public async Task<ActionResult<ACR>> UpdateCoordinator(int id, ACR acr)
        {
            var uacr = await _dbcontext.Admin.FindAsync(id);
            if (uacr == null)
            {
                return NotFound(new { msg = "Coordinator not found" });
            }
            if (!string.IsNullOrEmpty(acr.Contact) && await _dbcontext.Admin.AnyAsync(a => a.Id != id && a.Contact == acr.Contact))
            {
                return BadRequest(new { msg = "Contact already exists for another coordinator." });
            }
            uacr.Name = !string.IsNullOrEmpty(acr.Name) ? acr.Name : uacr.Name;
            uacr.Contact = !string.IsNullOrEmpty(acr.Contact) ? acr.Contact : uacr.Contact;
            uacr.DateOfBirth = acr.DateOfBirth != null ? acr.DateOfBirth : uacr.DateOfBirth;
            uacr.Gender = !string.IsNullOrEmpty(acr.Gender) ? acr.Gender : uacr.Gender;
            uacr.City = !string.IsNullOrEmpty(acr.City) ? acr.City : uacr.City;
            uacr.State = !string.IsNullOrEmpty(acr.State) ? acr.State : uacr.State;

            await _dbcontext.SaveChangesAsync();

            string messageBody = "<!DOCTYPE html>" +
                                "<html>" +
                                "<head>" +
                                "<title>Welcome to Live Score!</title>" +
                                "</head>" +
                                "<body>" +
                               $" <h2>Respected  {uacr.Name},</h2>" +
                                $"<p>Congratulations on joining Live Score! You're now registered as a  {acr.Password}. Get ready to manage live score updates and ensure seamless sports experiences for our users.</p>" +
                                "<p>Explore our platform tools to optimize your coordination tasks. For assistance, our support team is here to help.</p>" +
                                "<p>Welcome aboard!</p>" +
                                "<p>Best regards,<br />" +
                                " Live Score</p>" +
                                "</body>" +
                                "</html>";

            _emailSender.SendEmail(uacr.Email, "Successfully Registered", messageBody);

            return Ok(new { msg = "Coordinator updated successfully" });
        }

        [HttpPut("UpdateCoordinatorImage/{id}")]
        public async Task<IActionResult> UpdateCoordinatorImage(int id, [FromForm] UpdateImg updateImg)
        {
            var coordinator = await _dbcontext.Admin.FindAsync(id);
            if (coordinator == null)
            {
                return NotFound(new { msg = "Coordinator not found" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (updateImg.ImageFile != null)
            {
                // Delete existing image if it exists
                if (!string.IsNullOrEmpty(coordinator.ImageURL))
                {
                    // Delete existing image file
                    _imageUploader.DeleteImage(coordinator.ImageURL, "ACR");
                }

                // Upload and update new image
                string imageUrl = await _imageUploader.UploadImg(updateImg.ImageFile, "ACR");
                coordinator.ImageURL = imageUrl;

                try
                {
                    await _dbcontext.SaveChangesAsync();
                    return Ok(new { msg = "Coordinator Profile Picture successfully updated" , img = imageUrl });
                }
                catch (DbUpdateConcurrencyException)
                {
                    return NotFound(new { msg = "Coordinator Not Found" });
                }
            }
            return BadRequest(new { msg = "Image file is missing" });
        }

        //Refree Section
        [HttpGet("Referee")]
        public async Task<ActionResult<ACR>> GetReferee()
        {
            // Assuming role ID 3 corresponds to the coordinator role
            int refereeRoleId = 4;

            // Fetch the coordinator from ACR table with the specified ID and role ID 4
            var referee = await _dbcontext.Admin.Where(acr => acr.RoleId == refereeRoleId).ToListAsync();

            if (referee == null)
            {
                _logger.LogWarning($"Referee with ID  not found");
                return NotFound();
            }
            return Ok(referee);
        }

        //Adding referee
        [HttpPost("AddReferee")]
        public async Task<ActionResult<ACR>> PostReferee([FromForm] Imageacr acrimg)
        {
            if (string.IsNullOrEmpty(acrimg.Password))
            {
                return BadRequest(new { msg = "Please Enter all Field" });
            }

            // Check if the email already exists in the database
            if (_dbcontext.Admin.Any(a => a.Email == acrimg.Email))
            {
                return BadRequest(new { msg = "Email already exists" });
            }

            //checked if the contact already exists in the database
            if (_dbcontext.Admin.Any(a => a.Contact == acrimg.Contact))
            {
                return BadRequest(new { msg = "Contact already exists" });
            }
            string imageUrl = await _imageUploader.UploadImg(acrimg.ImageFile, "ACR");

            var acr = new ACR
            {
                Email = acrimg.Email,
                Name = acrimg.Name,
                Password = acrimg.Password,
                Contact = acrimg.Contact,
                DateOfBirth = acrimg.DateOfBirth,
                Gender = acrimg.Gender,
                City = acrimg.City,
                State = acrimg.State,
                Status = "Verified",
                ImageURL = imageUrl
            };

            acr.RoleId = 4;
            acr.Password = _pservice.HashPassword(acr.Password);
            _dbcontext.Admin.Add(acr);
            await _dbcontext.SaveChangesAsync();
            acr.Password = null;
            string messageBody = "<!DOCTYPE html>" +
                                   "<html>" +
                                   "<head>" +
                                   "<title>Welcome to Live Score!</title>" +
                                   "</head>" +
                                   "<body>" +
                                  $" <h2>Respected  {acr.Name},</h2>" +
                                   $"<p>Congratulations on joining Live Score! You're now registered as a  {acrimg.Password}. Get ready to manage live score updates and ensure seamless sports experiences for our users.</p>" +
                                   "<p>Explore our platform tools to optimize your coordination tasks. For assistance, our support team is here to help.</p>" +
                                   "<p>Welcome aboard!</p>" +
                                   "<p>Best regards,<br />" +
                                   " Live Score</p>" +
                                   "</body>" +
                                   "</html>";

            _emailSender.SendEmail(acr.Email, "SucessFully Registered", messageBody);

            return Ok(new { msg = "Successfully Added Referee" });
        }

        //Update Referee
        [HttpPut("updateReferee/{id}")]
        public async Task<ActionResult<ACR>> UpdateReferee(int id, ACR acr)
        {
            var uacr = await _dbcontext.Admin.FindAsync(id);
            if (uacr == null)
            {
                return NotFound(new { msg = "Referee not found" });
            }
            if (!string.IsNullOrEmpty(acr.Contact) && await _dbcontext.Admin.AnyAsync(a => a.Id != id && a.Contact == acr.Contact))
            {
                return BadRequest(new { msg = "Contact already exists for another Referee." });
            }
            uacr.Name = !string.IsNullOrEmpty(acr.Name) ? acr.Name : uacr.Name;
            uacr.Contact = !string.IsNullOrEmpty(acr.Contact) ? acr.Contact : uacr.Contact;
            uacr.DateOfBirth = acr.DateOfBirth != null ? acr.DateOfBirth : uacr.DateOfBirth;
            uacr.Gender = !string.IsNullOrEmpty(acr.Gender) ? acr.Gender : uacr.Gender;
            uacr.City = !string.IsNullOrEmpty(acr.City) ? acr.City : uacr.City;
            uacr.State = !string.IsNullOrEmpty(acr.State) ? acr.State : uacr.State;

            await _dbcontext.SaveChangesAsync();

            string messageBody = "<!DOCTYPE html>" +
                                "<html>" +
                                "<head>" +
                                "<title>Welcome to Live Score!</title>" +
                                "</head>" +
                                "<body>" +
                               $" <h2>Respected  {uacr.Name},</h2>" +
                                $"<p>Congratulations on joining Live Score! You're now registered as a  {acr.Password}. Get ready to manage live score updates and ensure seamless sports experiences for our users.</p>" +
                                "<p>Explore our platform tools to optimize your coordination tasks. For assistance, our support team is here to help.</p>" +
                                "<p>Welcome aboard!</p>" +
                                "<p>Best regards,<br />" +
                                " Live Score</p>" +
                                "</body>" +
                                "</html>";

            _emailSender.SendEmail(uacr.Email, "Successfully Updated", messageBody);

            return Ok(new { msg = "Referee updated successfully" });
        }

        [HttpPut("UpdateRefereeImage/{id}")]
        public async Task<IActionResult> UpdateRefereeImage(int id, [FromForm] UpdateImg updateImg)
        {
            var referee = await _dbcontext.Admin.FindAsync(id);
            if (referee == null)
            {
                return NotFound(new { msg = "Referee not found" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (updateImg.ImageFile != null)
            {
                // Delete existing image if it exists
                if (!string.IsNullOrEmpty(referee.ImageURL))
                {
                    // Delete existing image file
                    _imageUploader.DeleteImage(referee.ImageURL, "ACR");
                }

                // Upload and update new image
                string imageUrl = await _imageUploader.UploadImg(updateImg.ImageFile, "ACR");
                referee.ImageURL = imageUrl;

                try
                {
                    await _dbcontext.SaveChangesAsync();
                    return Ok(new { msg = "Referee image successfully updated" });
                }
                catch (DbUpdateConcurrencyException)
                {
                    return NotFound(new { msg = "Referee Not Found" });
                }
            }
            return BadRequest(new { msg = "Image file is missing" });
        }

        [HttpPost("BlockReferee/{id}")]
        public async Task<ActionResult<ACR>> BlockReferee(int id)
        {
            var coach = await _dbcontext.Admin.FindAsync(id);
            if (coach == null)
            {
                return NotFound(new { msg = "Referee Not Found" });
            }

            if (coach.Status == "UnBlock")
            {
                coach.Status = "Block";
                await _dbcontext.SaveChangesAsync();
                return Ok(new { msg = "Referee Is Blocked" });
            }
            if (coach.Status == "Block")
            {
                coach.Status = "UnBlock";
                await _dbcontext.SaveChangesAsync();
                return Ok(new { msg = "Referee Is UnBlocked" });
            }
            return Ok("Successful");
        }

        [HttpPost("FindEmail/{email}")]
        public async Task<ActionResult<ACR>> FindEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { msg = "Email parameter is required." });
            }

            var acr = await _dbcontext.Admin.FirstOrDefaultAsync(a => a.Email == email);
            if (acr == null)
            {
                return NotFound(new { msg = "Email Not Found" });
            }

            // for message body
            string messageBody = "<!DOCTYPE html>" +
                                 "<html>" +
                                 "<head>" +
                                 "<title>Forget Password</title>" +
                                 "</head>" +
                                 "<body>" +
                                 $"<h2>Respected {acr.Name},</h2>" +
                                 "<p>We received a request to reset your password for your Live Score account associated with this email address.</p>" +
                                 "<p>Please click the link below to reset your password:</p>" +
                                 $"<p><a href='http://localhost:5173/forgetPassword/{acr.Email}'>Reset Password</a></p>" +
                                 "<p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>" +
                                 "<p>For further assistance, our support team is here to help.</p>" +
                                 "<p>Best regards,<br />" +
                                 "Live Score Team</p>" +
                                 "</body>" +
                                 "</html>";


            _emailSender.SendEmail(acr.Email, "Forget Password", messageBody);

            return Ok(new { msg = "Forget password link send your email"});

        }

        [HttpPost("ForgetPassword")]
        public async Task<ActionResult<Login>> ForgetPassword([FromForm] Login login)
        {
            var acr = await _dbcontext.Admin.FirstOrDefaultAsync(a => a.Email == login.Email);

            if (acr == null)
            {
                return NotFound(new { msg = "Email Not Found" });
            }

            login.Password = _pservice.HashPassword(login.Password);
            acr.Password = login.Password;

            await _dbcontext.SaveChangesAsync();


            return Ok(new { msg = "Successfully forget password" }); ;
        }
    }
}
