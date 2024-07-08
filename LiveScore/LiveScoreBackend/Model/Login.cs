using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LiveScore.Model
{
    public class Login
    {
        public string Email { get; set; }       
        public string Password { get; set; }

    }
}
