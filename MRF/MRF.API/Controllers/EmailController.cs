using Microsoft.AspNetCore.Mvc;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.Models;
using MRF.Utility;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.Extensions.Configuration;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;


namespace MRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ISmtpEmailService _smtpEmailService;
        private readonly IEmailService _sendGridEmailService;
        private readonly ILoggerService _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly bool _useSendGrid;
        public EmailController(ISmtpEmailService smtpEmailService, ILoggerService logger, IUnitOfWork unitOfWork, IHostingEnvironment hostingEnvironment, IConfiguration configuration, IEmailService sendGridEmailService)
        {
            _smtpEmailService = smtpEmailService;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _hostingEnvironment = hostingEnvironment;
            _configuration = configuration;
            _sendGridEmailService = sendGridEmailService;
            _useSendGrid = _configuration.GetValue<bool>("FeatureToggles:UseSendGrid");
        }

        /// <summary>
        /// Sends an email.
        /// </summary>
        /// <param name="emailRequest">Email details</param>
        /// <returns>Result of the email sending operation.</returns>
        [HttpPost("send")]
        [SwaggerOperation(Summary = "Sends an email.")]
        [SwaggerResponse(200, "Email sent successfully.")]
        [SwaggerResponse(500, "Internal server error.")]
        public async Task<IActionResult> SendEmail(string Status)
        {
            try
            {
                emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == Status);

                if (emailRequest != null)
                {
                    if (_useSendGrid) 
                    {
                       await _sendGridEmailService.SendEmailAsync(emailRequest.emailTo, emailRequest.Subject, emailRequest.Content);
                    }
                    else
                    {
                        _smtpEmailService.SendEmail(emailRequest.emailTo, emailRequest.Subject, emailRequest.Content);
                    }
                    _logger.LogInfo("Email sent successfully.");
                    return Ok("Email sent successfully.");
                }
                else
                {
                    return Ok("Email not found for the given status.");
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it accordingly
                _logger.LogError($"Error sending email: {ex.Message}");
                return StatusCode(500, "An error occurred while sending email.");
            }
        }
    }
}
