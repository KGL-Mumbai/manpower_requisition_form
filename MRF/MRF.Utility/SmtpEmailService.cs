using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;

namespace MRF.Utility
{
    public class SmtpEmailService : ISmtpEmailService, IDisposable
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SmtpEmailService> _logger;
        private readonly string senderEmail;
        private readonly string smtpServer;
        private readonly int smtpPort;
        private readonly SmtpClient smtpClient;

        public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
        {
            _configuration = configuration;
            senderEmail = _configuration["SMTP:senderEmail"];
            smtpServer = _configuration["SMTP:Server"];
            smtpPort = Convert.ToInt32(_configuration["SMTP:Port"]);
            _logger = logger;
            smtpClient = new SmtpClient(smtpServer, smtpPort);
            smtpClient.UseDefaultCredentials = false;
        }

        public void SendEmail(string receiverEmail, string subject, string body, string? attachmentPath = null)
        {
            try
            {
                using (MailMessage mailMessage = new MailMessage(senderEmail, receiverEmail, subject, body))
                {
                    mailMessage.IsBodyHtml = true;
                    if (!string.IsNullOrEmpty(attachmentPath))
                    {
                        Attachment attachment = new Attachment(attachmentPath);
                        mailMessage.Attachments.Add(attachment);
                    }
                    smtpClient.Send(mailMessage);
                    _logger.LogInformation("Email sent successfully.");
                }
            }
            catch (SmtpException ex)
            {
                _logger.LogError("SMTP ERROR START");
                _logger.LogError($"message: {ex.Message}");              
                _logger.LogError("SMTP ERROR END");
            }
            catch (Exception ex)
            {
                _logger.LogError("EMAIL ERROR START");
                _logger.LogError($"message: {ex.Message}");
                _logger.LogError("SMTP ERROR END");             
            }
        }

        public bool IsValidUpdateValue(object value)
        {
            return value != null
            && !(value is int intValue && intValue == 0)
            && !(value is string stringValue && stringValue.Equals("string"))
            && !string.IsNullOrEmpty(value.ToString())
            && !(value is DateOnly dateOnlyValue && dateOnlyValue.Year == 1)
            && !(value is DateTime dateTimeValue && dateTimeValue == new DateTime(1, 1, 1, 0, 0, 0))
            && !(value is bool boolValue && !boolValue);
        }
        public void Dispose()
        {
            smtpClient.Dispose();
        }
    }
}
