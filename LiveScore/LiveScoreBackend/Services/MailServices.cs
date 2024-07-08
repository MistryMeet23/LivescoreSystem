using System.Net.Mail;
using System.Net;

namespace LiveScore.Services
{

    public interface IEmailSender
    {
        void SendEmail(string toEmail, string subject, string messageBody);
    }

    public class EmailSender : IEmailSender
    {
        public void SendEmail(string toEmail, string subject, string messageBody)
        {
            SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential("secretproviderict@gmail.com", "qpvn vrni adxx nhoy");

            // Create email message
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("secretproviderict@gmail.com", "Live Socre");
            mailMessage.To.Add(toEmail);
            mailMessage.Subject = subject;
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = messageBody;

            // Send email
            client.Send(mailMessage);
        }

    }


}
