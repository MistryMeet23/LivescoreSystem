using LiveScore.Data;
using LiveScore.Model;
using LiveScore.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LiveScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("CorsPolicy")]
    public class Logincontroller : ControllerBase
    {
        private readonly ApplicationDbContext _dbcontext;
        private readonly PasswordService _pservice;
        private readonly IConfiguration _config;

        public Logincontroller(ApplicationDbContext dbcontext, PasswordService pservice, IConfiguration config)
        {
            _dbcontext = dbcontext;
            _pservice = pservice;
            _config = config;
        }

        [HttpPost("Login")]
        public async Task<ActionResult<Login>> Login(Login login)
        {
            var user = await _dbcontext.Admin.FirstOrDefaultAsync(u => u.Email == login.Email);

            if (user == null)
            {
                return NotFound(new { msg = "Email not Found..." });
            }

            bool passwordMatches = _pservice.VerifyPassword(login.Password, user.Password);
            String status = user.Status;

            if (status == "Not Verified")
            {
                return Unauthorized(new { msg = "You Are Not Registered" });
            }
            if (status == "Block")
            {
                return Unauthorized(new { msg = "You Are Blocked" });
            }

            if (passwordMatches && status == "Verified")
            {
                user.LastLogin = DateTime.Now;
                await _dbcontext.SaveChangesAsync();
                var token = GenerateToken(user);
                return Ok(new { token = token, role = user.RoleId, id = user.Id, img = user.ImageURL, msg = "Welcome Back" });
            }
            else
            {
                return Unauthorized(new { msg = "Invalid credentials" });
            }
        }

        private string GenerateToken(ACR user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Name),
        new Claim(ClaimTypes.Role, user.RoleId.ToString()), // Ensure RoleId is included if you are checking roles
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };
            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
