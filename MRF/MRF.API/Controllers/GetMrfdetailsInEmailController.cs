using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using MRF.Models.ViewModels;
using MRF.Utility;
using Swashbuckle.AspNetCore.Annotations;

namespace MRF.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class GetMrfdetailsInEmailController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILoggerService _logger;
        private readonly ISmtpEmailService _emailService;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly IConfiguration _configuration;
        public GetMrfdetailsInEmailController(IUnitOfWork unitOfWork, ILoggerService logger, ISmtpEmailService emailService, IHostEnvironment hostEnvironment,  IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _emailService = emailService;
            _hostEnvironment = hostEnvironment;
            _configuration = configuration;
        }

        [HttpGet("{MrfId}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(MrfDetailsViewModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrfdetailsEmailRequestModel GetRequisition(int MrfId, int EmployeeId, int MrfStatusId)
        {
            var mrfdetail = _unitOfWork.MrfdetailsEmailRepository.GetRequisition(MrfId);
            if (mrfdetail == null)
            {
                _logger.LogError($"No result found by this Id:{MrfId}");
                return new MrfdetailsEmailRequestModel();
            }

            var emailTemplatePath = Path.Combine(_hostEnvironment.ContentRootPath, "EmailTemplate", "MRFEmailTemplate.html");
            var pdfFileName = $"{mrfdetail.ReferenceNo.Replace("/", "_")}.pdf";
            string htmlBody;
            using (var sourceReader = System.IO.File.OpenText(emailTemplatePath))
            {
                var builder = new BodyBuilder();
                builder.HtmlBody = sourceReader.ReadToEnd();
                htmlBody = GetHtmlTemplateBody(builder.HtmlBody, mrfdetail, EmployeeId, MrfStatusId);
            }

            //Commented code to convert html to pdf
            //_hTMLtoPDF.CovertHtmlToPDF(htmlBody, pdfFileName);
          
            var EmpDetails = _unitOfWork.Employeedetails.Get(u => u.Id == EmployeeId);

            //Get MRF Status
            var MrfStatus = _unitOfWork.Mrfstatusmaster.Get(u => u.Id == MrfStatusId);


            if (MrfStatus != null && EmpDetails != null)
                try
                {
                    _emailService.SendEmail(EmpDetails.Email, MrfStatus.Status, htmlBody); // TO DO : Discussion Required on Subject
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error while sending email: {ex}");
                }

            var emailMaster = _unitOfWork.emailmaster.Get(u => u.statusId == MrfStatusId);
            try
            {
                List<EmailRecipient> emailList = SendEmailOnStatus(MrfStatusId);
                foreach (var emailReq in emailList)
                {
                    try
                    {
                        _emailService.SendEmail(emailReq.Email, emailMaster.Subject, emailMaster.Content);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Error while sending email: {ex}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while sending email: {ex}");
            }

            return mrfdetail;
        }
        private string GetHtmlTemplateBody(string htmlBody, MrfdetailsEmailRequestModel mrfdetailemail, int employeeId, int MrfStatusId)
        {
            string base_url = _configuration["Links:BaseUrl"];

            int MrfId = mrfdetailemail.Id;
            int EmpId = employeeId;
            int StatusId = MrfStatusId;
            int RejectStatusId = 8;
            string strApprovalLink = $"{base_url}/approve?MrfId={MrfId}&EmpId={EmpId}&StatusId={StatusId}";
            string strRejectionLink = $"{base_url}/Reject?MrfId={MrfId}&EmpId={EmpId}&StatusId={RejectStatusId}";
            string strByPassLink = $"{base_url}/Bypass?MrfId={MrfId}&EmpId={EmpId}&StatusId={StatusId}";
            // Replace placeholders in HTML with data
            string messageBody = htmlBody
              .Replace("{ReferenceNo}", mrfdetailemail.ReferenceNo)
              .Replace("{NumberOfVacancies}", Convert.ToString(mrfdetailemail.NumberOfVacancies))
              .Replace("{MaxTargetSalary}", Convert.ToString((mrfdetailemail.MaxTargetSalary) / 100000))
              .Replace("{TotalTargetSalary}", Convert.ToString((mrfdetailemail.MaxTargetSalary * mrfdetailemail.NumberOfVacancies) / 100000))
              .Replace("{GradeMin}", mrfdetailemail.GradeMin)
              .Replace("{GradeMax}", mrfdetailemail.GradeMax)
              .Replace("{PositionName}", mrfdetailemail.PositionName)
              .Replace("{Department}", mrfdetailemail.Department)
              .Replace("{SubDepartment}", mrfdetailemail.SubDepartment)
              .Replace("{Project}", mrfdetailemail.Project)
              .Replace("{Justification}", mrfdetailemail.Justification)
              .Replace("{MRFRaisedBy}", Convert.ToString(mrfdetailemail.MRFRaisedBy))
              .Replace("{approvalLink}", strApprovalLink)
              .Replace("{rejectLink}", strRejectionLink)
              .Replace("{bypassLink}", strByPassLink);

            return messageBody;
        }
        
        private List<EmailRecipient> SendEmailOnStatus(int MrfStatusId)
        {
            List<EmailRecipient> obj = _unitOfWork.EmailRecipient.GetEmailRecipient(MrfStatusId);
            return obj;
        }
    }
}