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
        private readonly IEmailService _emailService;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly IConfiguration _configuration;
        private string mrfUrl = string.Empty;
        public GetMrfdetailsInEmailController(IUnitOfWork unitOfWork, ILoggerService logger, IEmailService emailService, IHostEnvironment hostEnvironment,  IConfiguration configuration)
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
        public async Task<MrfdetailsEmailRequestModel> GetRequisitionAsync(int MrfId, int EmployeeId,int nextMrfStatusId,int currentMrfStatusId)
        {
            
            var mrfdetail = _unitOfWork.MrfdetailsEmailRepository.GetRequisition(MrfId); //converted this to async method
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
                htmlBody = GetHtmlTemplateBody(builder.HtmlBody, mrfdetail, EmployeeId, nextMrfStatusId);
            }

            //Commented code to convert html to pdf
            //_hTMLtoPDF.CovertHtmlToPDF(htmlBody, pdfFileName);
          
            var EmpDetails = _unitOfWork.Employeedetails.Get(u => u.Id == EmployeeId);

            //Get MRF Status
            var MrfStatus = _unitOfWork.Mrfstatusmaster.Get(u => u.Id == currentMrfStatusId);


            if (MrfStatus != null && EmpDetails != null)
            {
                try
                {
                    _logger.LogInfo("Sending Email to HOD / Finance Head /COO");
                    _emailService.SendEmailAsync(EmpDetails.Email, MrfStatus.Status, htmlBody);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error while sending email: {ex}");
                }
            }
                
            //not being used
            /*var emailMaster = _unitOfWork.emailmaster.Get(u => u.statusId == currentMrfStatusId);
            try
            {
                List<EmailRecipient> emailList = SendEmailOnStatus(currentMrfStatusId, MrfId);
                foreach (var emailReq in emailList)
                {
                    try
                    {
                        mrfUrl = _configuration["MRFUrl"].Replace("ID", MrfId.ToString());
                        
                        string emailContent = emailMaster.Content.Replace("MRF ##", $"<span style='color:red; font-weight:bold;'>MRF Id {mrfdetail.ReferenceNo}</span>")
                                                 .Replace("click here", $"<span style='color:blue; font-weight:bold; text-decoration:underline;'><a href='{mrfUrl}'>click here</a></span>");
                        _emailService.SendEmailAsync(emailReq.Email, emailMaster.Subject, emailContent);
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
            }*/

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
              .Replace("{MaxTargetSalary}", Convert.ToString(mrfdetailemail.MaxTargetSalary))
              .Replace("{TotalTargetSalary}", Convert.ToString(mrfdetailemail.MaxTargetSalary * mrfdetailemail.NumberOfVacancies))
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
        
        private List<EmailRecipient> SendEmailOnStatus(int MrfStatusId, int MrfId)
        {
            List<EmailRecipient> obj = _unitOfWork.EmailRecipient.GetEmailRecipient(MrfStatusId,null, MrfId);
            return obj;
        }
    }
}