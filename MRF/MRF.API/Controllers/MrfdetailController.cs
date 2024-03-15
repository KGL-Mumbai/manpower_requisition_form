using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using MRF.Models.ViewModels;
using MRF.Utility;
using Swashbuckle.AspNetCore.Annotations;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MRF.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MrfdetailController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private ResponseDTO _response;
        private MrfdetaiResponseModel _responseModel;
        private FreshmrfdetailResponseModel _responseModelf;
        private readonly ILoggerService _logger;
        private readonly IEmailService _emailService;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly IConfiguration _configuration;
        private string mrfUrl = string.Empty;
        public MrfdetailController(IUnitOfWork unitOfWork, ILoggerService logger, IEmailService emailService, IHostEnvironment hostEnvironment, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _response = new ResponseDTO();
            _responseModel = new MrfdetaiResponseModel();
            _responseModelf = new FreshmrfdetailResponseModel();
            _logger = logger;
            _emailService = emailService;
            _hostEnvironment = hostEnvironment;
            _configuration = configuration;           
        }

        // GET: api/<MrfdetailController>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Mrfdetails>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get()
        {
            _logger.LogInfo("Fetching All MRF Details");
            List<Mrfdetails> mrfdetailsList = _unitOfWork.Mrfdetail.GetAll().ToList();
            if (mrfdetailsList.Count == 0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = mrfdetailsList;
            _response.Count = mrfdetailsList.Count;
            _logger.LogInfo($"Total mrf details count: {mrfdetailsList.Count}");
            return _response;
        }

        // GET api/<MrfdetailController>/5
        [HttpGet("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(Mrfdetails))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get(int id)
        {
            _logger.LogInfo($"Fetching All MRF Details by Id: {id}");
            Mrfdetails mrfdetail = _unitOfWork.Mrfdetail.Get(u => u.Id == id);
            if (mrfdetail == null)
            {
                _logger.LogError($"No result found by this Id:{id}");
            }
            _response.Result = mrfdetail;
            return _response;
        }

        // POST api/<MrfdetailController>
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, Description = "Item created successfully", Type = typeof(MrfdetaiResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrfdetaiResponseModel Post([FromBody] MrfdetailRequestModel request)
        {
            _logger.LogInfo($"Post All MRF Details");
            {
                string ReferenceNo = string.Empty;
                int rId = 0;
                if (request.ReferenceNo != "")
                {
                    var res = Put(request.mrfID ?? 0, request);
                    mrfUrl = _configuration["MRFUrl"].Replace("ID", res.Id.ToString());
                    ReferenceNo = request.ReferenceNo;
                    rId = res.Id;
                }
                else
                {
                    var result = GenerateMrfReferenceNumber(request);
                    ReferenceNo = result.Reference;
                    MrfLastNumber Number = result.Number;

                    var mrfDetail = Mrfdetail(request, ReferenceNo);

                    _unitOfWork.Mrfdetail.Add(mrfDetail);
                    _unitOfWork.Save();

                    _responseModel.Id = mrfDetail.Id;
                    rId = mrfDetail.Id;
                    mrfUrl = _configuration["MRFUrl"].Replace("ID", mrfDetail.Id.ToString());
                    if (mrfDetail.Id != 0)
                    {
                        request.mrfID = mrfDetail.Id;
                        CallFreshmrfdetailController(request, mrfDetail.Id, false);
                        if (Number.LastNumber > 0)
                        {
                            _unitOfWork.MrfLastNo.Update(Number);
                            _unitOfWork.Save();
                        }
                    }
                    else
                    {
                        _logger.LogError($"Unable to add mrf details");

                    }
                }

                emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.statusId == request.MrfStatusId);
                var mrfdetails = _unitOfWork.Mrfdetail.GetRequisition(rId); //gets all mrf details

                if (emailRequest != null)
                {
                    string emailContent = emailRequest.Content.Replace("MRF ##", $"<span style='color:red; font-weight:bold;'>MRF {mrfdetails.ReferenceNo}</span>")
                                                      .Replace("click here", $"<span style='color:blue; font-weight:bold; text-decoration:underline;'><a href='{mrfUrl}'>click here</a></span>");

                    //Send Email to HR - Skipping if MRF Status is Drafted : MRF Status Id = 1 (Drafted)
                    if (request.MrfStatusId != 1)
                    {
                        
                        if (request.HrId > 0)
                        {
                            //email only to current hr
                            _emailService.SendEmailAsync(_unitOfWork.EmailRecipient.getEmail((int)mrfdetails.HrId), emailRequest.Subject, emailContent);
                        }
                        else
                        {
                            var emps = _unitOfWork.EmailRecipient.GetRoleEmails("4");
                            foreach(var e in emps)
                            {
                                _emailService.SendEmailAsync(e, emailRequest.Subject, emailContent);
                            }
                        }
                    }

                    //Send Email to MRF Owner(hiring manager)
                    if (mrfdetails.HiringManagerId > 0) _emailService.SendEmailAsync(_unitOfWork.EmailRecipient.getEmail(mrfdetails.HiringManagerId), emailRequest.Subject, emailContent);

                }
                return _responseModel;
            }
        }

        private Mrfdetails Mrfdetail(MrfdetailRequestModel request, string ReferenceNo)
        {
            var mrfDetail = new Mrfdetails
            {
                ReferenceNo = ReferenceNo,
                PositionTitleId = request.PositionTitleId == 0 ? null : request.PositionTitleId,
                RequisitionType = request.RequisitionType,
                DepartmentId = request.DepartmentId == 0 ? null : request.DepartmentId,
                SubDepartmentId = request.SubDepartmentId == 0 ? null : request.SubDepartmentId,
                ProjectId = request.ProjectId == 0 ? null : request.ProjectId,
                VacancyNo = request.VacancyNo,
                GenderId = request.GenderId == 0 ? null : request.GenderId,
                RequisitionDateUtc = request.RequisitionDateUtc,
                ReportsToEmployeeId = request.ReportsToEmployeeId == 0 ? null : request.ReportsToEmployeeId,
                MinGradeId = request.MinGradeId == 0 ? null : request.MinGradeId,
                MaxGradeId = request.MaxGradeId == 0 ? null : request.MaxGradeId,
                EmploymentTypeId = request.EmploymentTypeId == 0 ? null : request.EmploymentTypeId,
                MinExperience = request.MinExperience == 0 ? 0 : request.MinExperience,
                MaxExperience = request.MaxExperience == 0 ? 0 : request.MaxExperience,
                VacancyTypeId = request.VacancyTypeId == 0 ? null : request.VacancyTypeId,
                IsReplacement = request.IsReplacement,
                MrfStatusId = request.MrfStatusId,
                JdDocPath = request.JdDocPath ?? "",
                LocationId = request.LocationId == 0 ? null : request.LocationId,
                QualificationId = request.QualificationId == 0 ? null : request.QualificationId,
                HrId=request.HrId == 0 ? null : request.HrId,
                CreatedByEmployeeId = request.CreatedByEmployeeId,
                CreatedOnUtc = request.CreatedOnUtc,
                UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                UpdatedOnUtc = request.UpdatedOnUtc
            };
            return mrfDetail;
        }

        private void CallFreshmrfdetailController(MrfdetailRequestModel request, int mrfId, bool Update)
        {
            var freshmrRequest = Freshmrfdetail(request, mrfId);
            FreshmrfdetailResponseModel freshmrResponse = new FreshmrfdetailResponseModel();
            if (Update)
            {
                FreshmrfdetailController freshmrController = new FreshmrfdetailController(_unitOfWork, _logger);
                freshmrResponse = freshmrController.Put(0, freshmrRequest);
            }
            else
            {
                FreshmrfdetailController freshmrController = new FreshmrfdetailController(_unitOfWork, _logger);
                freshmrResponse = freshmrController.Post(freshmrRequest);
            }

            if (freshmrResponse.Id != 0)
            {
                /*var MrfdetailRequestModelRequest = new MrfEmailApprovalRequestModel
                {
                    MrfId = mrfId,
                    RoleId = 3,
                    EmployeeId = request.CreatedByEmployeeId,
                    ApprovalDate = request.HMApprovalDate
                };*/

                //add mrf owner as a hiring manager
                AddUpdateEmailApproval(mrfId, request.CreatedByEmployeeId, 3, request.HMApprovalDate);

                //postMrfEmail(MrfdetailRequestModelRequest);

                int nextMrfStatusId;
                CallEmailApprovalController(request, mrfId, Update, out nextMrfStatusId);
                CallReplacementController(request, mrfId, Update);
                CallreviewerController(request, mrfId, Update);
            }
            else
            {
                _logger.LogError($"Unable to add mrf details");
            }
        }

        private FreshmrfdetailRequestModel Freshmrfdetail(MrfdetailRequestModel request, int mrfId)
        {
            var freshmrRequest = new FreshmrfdetailRequestModel
            {
                MrfId = mrfId,
                Justification = request.Justification ?? "",
                JobDescription = request.JobDescription ?? "",
                Skills = request.Skills ?? "",
                MinTargetSalary = request.MinTargetSalary ?? 0,
                MaxTargetSalary = request.MaxTargetSalary ?? 0,
                CreatedByEmployeeId = request.CreatedByEmployeeId,
                CreatedOnUtc = request.CreatedOnUtc,
                UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                UpdatedOnUtc = request.UpdatedOnUtc
            };

            return freshmrRequest;
        }

        //async method, but replaced it
        /*private async Task CallGetMrfdetailsInEmailController(int MrfId, int EmployeeId, int nextMrfStatusId, int currentMrfStatusId)
        {
            GetMrfdetailsInEmailController getMrfdetailsInEmailController =
                new GetMrfdetailsInEmailController(_unitOfWork, _logger, _emailService, _hostEnvironment, _configuration);
            await getMrfdetailsInEmailController.GetRequisitionAsync(MrfId, EmployeeId, nextMrfStatusId, currentMrfStatusId);
        }*/

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

        private bool CallGetMrfdetailsInEmailController(int MrfId, int EmployeeId, int nextMrfStatusId, int currentMrfStatusId)
        {
            var mrfdetail = _unitOfWork.MrfdetailsEmailRepository.GetRequisition(MrfId);
            if (mrfdetail == null)
            {
                _logger.LogError($"No result found by this Id:{MrfId}");
                return false;
            }

            var emailTemplatePath = Path.Combine(_hostEnvironment.ContentRootPath, "EmailTemplate", "MRFEmailTemplate.html");
            string htmlBody;
            using (var sourceReader = System.IO.File.OpenText(emailTemplatePath))
            {
                var builder = new BodyBuilder();
                builder.HtmlBody = sourceReader.ReadToEnd();
                htmlBody = GetHtmlTemplateBody(builder.HtmlBody, mrfdetail, EmployeeId, nextMrfStatusId);
            }

            var EmpDetails = _unitOfWork.Employeedetails.Get(u => u.Id == EmployeeId);

            //Get MRF Status
            var MrfStatus = _unitOfWork.Mrfstatusmaster.Get(u => u.Id == currentMrfStatusId);


            if (MrfStatus != null && EmpDetails != null)
            {
                _logger.LogInfo("Sending Email to HOD / Finance Head /COO");
                _emailService.SendEmailAsync(EmpDetails.Email, MrfStatus.Status, htmlBody);
                return true;
            }
            return false;
        }

        private int CallEmailApprovalController(MrfdetailRequestModel request, int mrfId, bool Update, out int nextMrfStatusId) 
        {
            int employeeId = 0; int RoleID = 0;
            nextMrfStatusId = request.MrfStatusId;
            //List<MrfEmailApproval> list = _unitOfWork.MrfEmailApproval.GetList(mrfId);
            /*if (request.HrId != null && request.HrId != 0)
            {
                RoleID = 4;
                //employeeId = request.HrId;
                var MrfEmailApprovalRequestModel = new MrfEmailApprovalRequestModel
                {
                    MrfId = mrfId,
                    EmployeeId = (int)request.HrId,
                    RoleId = RoleID,
                    //ApprovalDate = request.CreatedOnUtc,
                };
                MrfEmailApprovalController controller = new MrfEmailApprovalController(_unitOfWork, _logger);
                MrfEmailApproval MrfEmailApproval = list.Where(s => s.EmployeeId == employeeId && s.RoleId == RoleID).FirstOrDefault();
                if (MrfEmailApproval == null)
                {
                    postMrfEmail(MrfEmailApprovalRequestModel);
                }
            }*/
            if (request.FunctionHeadId != 0)
            {
                RoleID = 8;
                nextMrfStatusId = 4;
                employeeId = request.FunctionHeadId;
                AddUpdateEmailApproval(mrfId, employeeId, RoleID, request.FHApprovalDate);
            }
            if (request.HiringManagerId != 0)
            {
                RoleID = 3;
                employeeId = request.HiringManagerId;
                AddUpdateEmailApproval(mrfId, employeeId, RoleID, request.HMApprovalDate);
            }

            if (request.SiteHRSPOCId != 0 || (request.HrId != null && request.HrId != 0))
            {
                RoleID = 4; DateOnly approveDate = request.SPApprovalDate;
                if (request.SiteHRSPOCId != 0) { employeeId = request.SiteHRSPOCId;
                
                } else if(request.HrId != null && request.HrId != 0)
                { employeeId = (int)(request.HrId); 
                  approveDate = DateOnly.FromDateTime(DateTime.Today); }
                
                if (employeeId != 0) {
                    AddUpdateEmailApproval(mrfId, employeeId, RoleID, approveDate);
                }
            }
            if (request.FinanceHeadId != 0)
            {
                RoleID = 10;
                employeeId = request.FinanceHeadId;
                nextMrfStatusId = 14;
                AddUpdateEmailApproval(mrfId, employeeId, RoleID, request.FIApprovalDate);
            }

            if (request.PresidentnCOOId != 0)
            {
                RoleID = 11;
                employeeId = request.PresidentnCOOId;
                nextMrfStatusId = 5;
                AddUpdateEmailApproval(mrfId, employeeId, RoleID, request.PCApprovalDate);
            }
            return employeeId;
        }
        private void AddUpdateEmailApproval(int mrfId, int employeeId, int roleId, DateOnly ApprovalDate)
        {
            List<MrfEmailApproval> list = _unitOfWork.MrfEmailApproval.GetA(u=>u.MrfId== mrfId).ToList();
            var MrfEmailApprovalRequestModel = new MrfEmailApprovalRequestModel
            {
                MrfId = mrfId,
                EmployeeId = employeeId,
                RoleId = roleId,
                ApprovalDate = ApprovalDate
            };
            MrfEmailApprovalController controller = new MrfEmailApprovalController(_unitOfWork, _logger);
            MrfEmailApproval MrfEmailApproval = list.Where(s => s.RoleId == roleId).FirstOrDefault();
            if (MrfEmailApproval == null)
            {
                postMrfEmail(MrfEmailApprovalRequestModel);
            }
            else
            {
                controller.Put(MrfEmailApproval.Id, MrfEmailApprovalRequestModel);
            }

        }
        private void postMrfEmail(MrfEmailApprovalRequestModel MrfdetailRequestModelRequest)
        {
            MrfEmailApprovalController MrfEmailApprovalController = new MrfEmailApprovalController(_unitOfWork, _logger);
            var MrfEmailApprovalResponse = MrfEmailApprovalController.Post(MrfdetailRequestModelRequest);
        }

        private void putMrfEmail(int MrfId)
        {
            MrfEmailApprovalController MrfEmailApprovalController = new MrfEmailApprovalController(_unitOfWork, _logger);
            MrfEmailApprovalController.Delete(MrfId);
        }

        private void postMrfHistory(mrfDetailsStatusHistoryRequestModel MrfdetailRequestModelRequest)
        {
            mrfDetailsStatusHistoryController mrfDetailsStatusHistoryController = new mrfDetailsStatusHistoryController(_unitOfWork, _logger);
            var mrfDetailsStatusHistoryResponse = mrfDetailsStatusHistoryController.Post(MrfdetailRequestModelRequest);
        }

        private void CallMrfHistory(MrfdetailRequestModel request, int mrfId, int StatusId)
        {
            var mrfDetailsStatusHistory = new mrfDetailsStatusHistoryRequestModel
            {
                MrfId = mrfId,
                mrfStatusId = StatusId,
                CreatedByEmployeeId = request.UpdatedByEmployeeId,
                CreatedOnUtc = request.UpdatedOnUtc,
            };
            postMrfHistory(mrfDetailsStatusHistory);
        }
        private void CallReplacementController(MrfdetailRequestModel request, int mrfId, bool Update)
        {
            if (request.IsReplacement)
            {
                var ReplacementmrfdetailRequest = Replacementmrfdetail(request, mrfId);

                if (Update)
                {
                    ReplacementmrfdetailController freshmrController = new ReplacementmrfdetailController(_unitOfWork, _logger);
                    var ReplacementmrfdetailResponse = freshmrController.Put(0, ReplacementmrfdetailRequest);
                }
                else
                {
                    ReplacementmrfdetailController freshmrController = new ReplacementmrfdetailController(_unitOfWork, _logger);
                    var ReplacementmrfdetailResponse = freshmrController.Post(ReplacementmrfdetailRequest);
                }
            }
        }

        private ReplacementmrfdetailRequestModel Replacementmrfdetail(MrfdetailRequestModel request, int mrfId)
        {
            var ReplacementmrfdetailRequest = new ReplacementmrfdetailRequestModel
            {
                MrfId = mrfId,
                EmployeeName = request.EmployeeName,
                EmailId = request.EmailId,
                EmployeeCode = request.EmployeeCode,
                LastWorkingDate = request.LastWorkingDate,
                AnnualCtc = request.AnnualCtc,
                AnnualGross = request.AnnualGross,
                CreatedByEmployeeId = request.CreatedByEmployeeId,
                CreatedOnUtc = request.CreatedOnUtc,
                UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                UpdatedOnUtc = request.UpdatedOnUtc,
                Justification = request.ReplaceJustification,
            };
            return ReplacementmrfdetailRequest;
        }
        private void CallreviewerController(MrfdetailRequestModel request, int mrfId, bool Update)
        {
            bool isDraft = (request.MrfStatusId == 1); //checking to not send email when status is draft

            if (string.IsNullOrEmpty(request.ResumeReviewerEmployeeIds))
            {
                MrfresumereviewermapController resumereviewermap = new MrfresumereviewermapController(_unitOfWork, _logger, _emailService, _hostEnvironment);
                resumereviewermap.DeletebyMRFId(mrfId);
            }

            if (!string.IsNullOrEmpty(request.ResumeReviewerEmployeeIds))
            {
                request.ResumeReviewerEmployeeIds.Replace("0", "");
                MrfresumereviewermapController resumereviewermap = new MrfresumereviewermapController(_unitOfWork, _logger, _emailService, _hostEnvironment);
                resumereviewermap.DeletebyMRFId(mrfId);
                // Split the comma-separated string into an array of IDs
                var employeeIds = request.ResumeReviewerEmployeeIds.Split(',');

                // Create a new MrfresumereviewermapRequestModel for each employee ID
                foreach (var employeeId in employeeIds)
                {
                    var mrfresumereviewermap = new MrfresumereviewermapRequestModel
                    {
                        MrfId = mrfId,
                        ResumeReviewerEmployeeId = int.Parse(employeeId), // Convert the ID to the appropriate type
                        IsActive = isDraft,
                        CreatedByEmployeeId = request.CreatedByEmployeeId,
                        CreatedOnUtc = request.CreatedOnUtc,
                        UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                        UpdatedOnUtc = request.UpdatedOnUtc
                    };
                    
                    var resumereviewermapResponse = resumereviewermap.Post(mrfresumereviewermap);
                }
            }

            if (string.IsNullOrEmpty(request.InterviewerEmployeeIds))
            {
                MrfinterviewermapController interviewermap = new MrfinterviewermapController(_unitOfWork, _logger, _emailService, _hostEnvironment);
                interviewermap.DeleteMRFInterview(mrfId);
            }

            if (!string.IsNullOrEmpty(request.InterviewerEmployeeIds))
            {
                request.InterviewerEmployeeIds.Replace("0", "");
                MrfinterviewermapController interviewermap = new MrfinterviewermapController(_unitOfWork, _logger, _emailService, _hostEnvironment);
                interviewermap.DeleteMRFInterview(mrfId);

                var employeeIds = request.InterviewerEmployeeIds.Split(',');
                foreach (var employeeId in employeeIds)
                {
                    var mrfinterviewermap = new MrfinterviewermapRequestModel
                    {
                        MrfId = mrfId,
                        InterviewerEmployeeId = int.Parse(employeeId),
                        IsActive = isDraft,
                        CreatedByEmployeeId = request.CreatedByEmployeeId,
                        CreatedOnUtc = request.CreatedOnUtc,
                        UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                        UpdatedOnUtc = request.UpdatedOnUtc
                    };
                    var interviewermapResponse = interviewermap.Post(mrfinterviewermap);
                }
            }
        }

        // PUT api/<MrfdetailController>/5
        [HttpPut("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item updated successfully", Type = typeof(MrfdetaiResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful update)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrfdetaiResponseModel Put(int id, [FromBody] MrfdetailRequestModel request)
        {
            Mrfdetails existingStatus = new Mrfdetails();
            if (id == 0)
            {
                existingStatus = _unitOfWork.Mrfdetail.Get(u => u.ReferenceNo == request.ReferenceNo);
            }
            else
            {
                existingStatus = _unitOfWork.Mrfdetail.Get(u => u.Id == id);
            }
            if (existingStatus != null)
            {
                existingStatus.ReferenceNo = request.ReferenceNo;
                existingStatus.PositionTitleId = request.PositionTitleId;
                existingStatus.DepartmentId = request.DepartmentId == 0 ? null : request.DepartmentId;
                existingStatus.SubDepartmentId = request.SubDepartmentId == 0 ? null : request.SubDepartmentId;
                existingStatus.ProjectId = request.ProjectId == 0 ? null : request.ProjectId;
                existingStatus.VacancyNo = request.VacancyNo;
                existingStatus.GenderId = request.GenderId == 0 ? null : request.GenderId;
                existingStatus.RequisitionDateUtc = request.RequisitionDateUtc;
                existingStatus.ReportsToEmployeeId = request.ReportsToEmployeeId == 0 ? null : request.ReportsToEmployeeId;
                existingStatus.MinGradeId = request.MinGradeId == 0 ? null : request.MinGradeId;
                existingStatus.MaxGradeId = request.MaxGradeId == 0 ? null : request.MaxGradeId;
                existingStatus.EmploymentTypeId = request.EmploymentTypeId == 0 ? null : request.EmploymentTypeId;
                existingStatus.MinExperience = request.MinExperience == 0 ? 0 : request.MinExperience;
                existingStatus.MaxExperience = request.MaxExperience == 0 ? 0 : request.MaxExperience;
                existingStatus.VacancyTypeId = request.VacancyTypeId == 0 ? null : request.VacancyTypeId;
                existingStatus.IsReplacement = request.IsReplacement;
                existingStatus.MrfStatusId = request.MrfStatusId;
                existingStatus.JdDocPath = request.JdDocPath;
                existingStatus.LocationId = request.LocationId == 0 ? null : request.LocationId;
                existingStatus.QualificationId = request.QualificationId == 0 ? null : request.QualificationId;
                existingStatus.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                existingStatus.UpdatedOnUtc = request.UpdatedOnUtc;
                existingStatus.HrId = request.HrId > 0 ? request.HrId : null;

                _unitOfWork.Mrfdetail.Update(existingStatus);
                _unitOfWork.Save();
                _responseModel.Id = existingStatus.Id;
                request.mrfID = existingStatus.Id;
                id = existingStatus.Id;
                CallFreshmrfdetailController(request, id, true);
            }
            else
            {
                _logger.LogError($"No result found by this Id: {id}");
                _responseModel.Id = 0;
            }
            return _responseModel;
        }

        // PUT api/<MrfdetailController>/5
        [HttpPut("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item updated successfully", Type = typeof(MrfdetaiResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful update)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrfdetaiResponseModel PartialUpdateMRFStatus(int id, [FromBody] MrfdetailRequestModel request)
        {
            var existingStatus = _unitOfWork.Mrfdetail.Get(u => u.Id == id);
            mrfUrl = _configuration["MRFUrl"].Replace("ID", id.ToString());
            if (existingStatus != null)
            {
                int mrfstatus = existingStatus.MrfStatusId;
                var entityType = existingStatus.GetType();
                foreach (var propertyInfo in typeof(MrfdetailRequestModel).GetProperties())
                {
                    var entityProperty = entityType.GetProperty(propertyInfo.Name);
                    if (entityProperty != null)
                    {
                        var valueToUpdate = propertyInfo.GetValue(request);
                        if ((valueToUpdate != null) && _emailService.IsValidUpdateValue(valueToUpdate))
                        {
                            entityProperty.SetValue(existingStatus, valueToUpdate);
                        }
                    }
                }

                if (request.SiteHRSPOCId > 0) existingStatus.HrId = request.SiteHRSPOCId;

                _unitOfWork.Mrfdetail.Update(existingStatus);
                _unitOfWork.Save();

                _responseModel.Id = existingStatus.Id;

                int nextMrfStatusId;
                int employeeId = CallEmailApprovalController(request, id, false, out nextMrfStatusId); //saves approval history
                CallMrfHistory(request, id, mrfstatus); //saves mrf update history

                MrfdetailRequestModel mrfdetails = _unitOfWork.Mrfdetail.GetRequisition(id); //gets all mrf details

                emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.statusId == request.MrfStatusId);

                if (new List<int> { 11, 12, 13 }.Contains(request.MrfStatusId))
                {
                    bool emailSent =  CallGetMrfdetailsInEmailController(id, employeeId, nextMrfStatusId, request.MrfStatusId); //emails approval requests
                    if (!emailSent) _logger.LogError($"No Email Sent to HOD / Finance Head /COO for MrfId: {id}");

                    if (emailRequest != null)
                    {
                        string emailContent = emailRequest.Content.Replace("MRF ##", $"<span style='color:red; font-weight:bold;'>MRF {existingStatus.ReferenceNo}</span>")
                                                 .Replace("click here", $"<span style='color:blue; font-weight:bold; text-decoration:underline;'><a href='{mrfUrl}'>click here</a></span>");
                        //Send Email to HR
                        /*List<EmailRecipient> emailList = _unitOfWork.EmailRecipient.GetEmployeeEmail("HR"); //gets for all the emps which have hr role currently
                        foreach (var emailReq in emailList)
                        {
                            _emailService.SendEmailAsync(emailReq.Email, emailRequest.Subject, emailContent);
                        }*/

                        //email only to the current hr which updates the status
                        if (existingStatus.HrId > 0) _emailService.SendEmailAsync(_unitOfWork.EmailRecipient.getEmail((int)existingStatus.HrId), emailRequest.Subject, emailContent);

                        //Send Email to MRF Owner(hiring manager)
                        if (mrfdetails.HiringManagerId > 0) _emailService.SendEmailAsync(_unitOfWork.EmailRecipient.getEmail(mrfdetails.HiringManagerId), emailRequest.Subject, emailContent);
                    }
                }
                else
                {
                    //Mrfstatusmaster mrfstatusmaster = _unitOfWork.Mrfstatusmaster.Get(u => u.Id == request.MrfStatusId);
                    //emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == mrfstatusmaster.Status);
                    if (emailRequest != null)
                    {
                        List<int> RoleIds = new List<int>();
                        RoleIds = emailRequest.roleId.Split(',').Select(int.Parse).ToList();

                        string emailSubject = emailRequest.Subject.Replace("##", $"{existingStatus.ReferenceNo}");
                        string emailContent = emailRequest.Content.Replace("MRF ##", $"<span style='color:red; font-weight:bold;'>MRF {existingStatus.ReferenceNo}</span>")
                                                          .Replace("click here", $"<span style='color:blue; font-weight:bold; text-decoration:underline;'><a href='{mrfUrl}'>click here</a></span>");

                        //sends email to all emails having a particular role
                        //need to fix it so that email is sent to only involved people having the given roleIds are sent email 
                        /*List<EmailRecipient> rejectedEmailList = _unitOfWork.EmailRecipient.GetEmployeeEmailByRoleIds(RoleIds);

                        foreach (var emailReq in rejectedEmailList)
                        {
                            _emailService.SendEmailAsync(emailReq.Email, emailSubject, emailContent);
                        }*/
                        //for now email only to the current hr
                        if (existingStatus.HrId > 0) _emailService.SendEmailAsync(_unitOfWork.EmailRecipient.getEmail((int)existingStatus.HrId), emailSubject, emailContent);

                        //Send Email to MRF Owner(hiring manager)
                        if (mrfdetails.HiringManagerId > 0) _emailService.SendEmailAsync(_unitOfWork.EmailRecipient.getEmail(mrfdetails.HiringManagerId), emailSubject, emailContent);

                        //send email to hod on open/rejected/onhold
                        bool sendHodEmail = new List<int> { 6, 8 }.Contains(request.MrfStatusId) && mrfdetails.FunctionHeadId > 0;
                        if (sendHodEmail) _emailService.SendEmailAsync(_unitOfWork.EmailRecipient.getEmail(mrfdetails.FunctionHeadId), emailSubject, emailContent);
                    }
                }
            }
            else
            {
                _logger.LogError($"No result found by this Id: {id}");
                _responseModel.Id = 0;
            }
            return _responseModel;
        }

        // DELETE api/<MrfdetailController>/5
        [HttpDelete("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item deleted successfully", Type = typeof(MrfdetaiResponseModel))]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful deletion)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrfdetaiResponseModel Delete(int id)
        {
            try
            {
                Mrfdetails? obj = _unitOfWork.Mrfdetail.Get(u => u.Id == id);
                Freshmrfdetails? freshMrf = _unitOfWork.Freshmrfdetail.Get(u => u.MrfId == id);
                List<MrfEmailApproval> email = _unitOfWork.MrfEmailApproval.GetA(u => u.MrfId == id).ToList();
                Replacementmrfdetails replacement = _unitOfWork.Replacementmrfdetail.Get(u => u.MrfId == id);
                List<Mrfresumereviewermap> resume = _unitOfWork.Mrfresumereviewermap.GetA(u => u.MrfId == id).ToList();
                List<Mrfinterviewermap> interviewer = _unitOfWork.Mrfinterviewermap.GetA(u => u.MrfId == id).ToList();

                if (obj != null)
                {
                    if (freshMrf != null)
                    {
                        _unitOfWork.Freshmrfdetail.Remove(freshMrf);
                        _unitOfWork.Save();
                    }
                    if (email != null)
                    {
                        foreach (MrfEmailApproval email1 in email)
                        {
                            _unitOfWork.MrfEmailApproval.Remove(email1);
                            _unitOfWork.Save();
                        }
                    }
                    if (replacement != null)
                    {
                        _unitOfWork.Replacementmrfdetail.Remove(replacement);
                        _unitOfWork.Save();
                    }
                    if (resume != null)
                    {
                        foreach (Mrfresumereviewermap res in resume)
                        {
                            _unitOfWork.Mrfresumereviewermap.Remove(res);
                            _unitOfWork.Save();
                        }
                    }
                    if (interviewer != null)
                    {
                        foreach (Mrfinterviewermap inter in interviewer)
                        {
                            _unitOfWork.Mrfinterviewermap.Remove(inter);
                            _unitOfWork.Save();
                        }
                    }
                    _unitOfWork.Mrfdetail.Remove(obj);
                    _unitOfWork.Save();
                    _responseModel.Id = obj.Id;
                }
                else
                {
                    _logger.LogError($"No result found by this Id: {id}");
                    _responseModel.Id = 0;
                }
            }
            catch (ArgumentNullException e)
            {
                _logger.LogError($"Error sending email: {e.Message}");
                StatusCode(500, "An error occurred while deleting entry.");
                _responseModel.Id = 0;
            }
            return _responseModel;
        }

        // GET api/<MrfdetailController>/5
        //[HttpGet("{statusId},{roleId}")]
        [HttpGet("GetMrfDetails")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(MrfDetailsViewModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO GetMrfDetails(int statusId, int roleId, int userId)
        {
            List<MrfDetailsViewModel> mrfdetail = _unitOfWork.MrfStatusDetail.GetMrfStatusDetails(statusId, roleId, userId);
            var res = mrfdetail;
            if (!res.Any())
            {
                _logger.LogError($"No result found by this Id:");
            }
            
            if (res.Any() && roleId == 3) //only for mrf owner
            {
                var mrfIds = mrfdetail.Select(x => x.MrfId).ToList();
                var mea = _unitOfWork.MrfEmailApproval.GetListFromMrfIds(mrfIds, userId, roleId); //gets list of mrfids where mrfowner is hiring manager
                res = mrfdetail.Where(x => mea.Contains(x.MrfId)).ToList();
            }

            _response.Result = res;
            return _response;
        }
        // GET api/<MrfdetailController>/
        [HttpGet("{MrfId}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(MrfDetailsViewModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrfdetailRequestModel GetRequisition(int MrfId)
        {
            _logger.LogInfo($"Fetching All MRF Details by Id: {MrfId}");
            MrfdetailRequestModel mrfdetail = _unitOfWork.Mrfdetail.GetRequisition(MrfId);
            if (mrfdetail == null)
            {
                _logger.LogError($"No result found by this Id:{MrfId}");
                MrfdetailRequestModel blankData = new MrfdetailRequestModel();
                return blankData;
            }
            else
            {
                /*if (mrfdetail.MrfStatusId == 8) //when rejected
                {
                    var approvalList = _unitOfWork.mrfDetailsStatusHistory.GetA(x=> x.MrfId == MrfId && x.mrfStatusId == 8);
                    if (approvalList.Any()) mrfdetail.RejectedById = approvalList.First().CreatedByEmployeeId; 

                }*/
                return mrfdetail;
            }
        }
        /*
         Reference Number: [Format: No. of positions (in 2 digits) / Location Name (in 3 alphabets)/ 
                            Type (RP/ CRP/ FR/ CFR) / MMM/ YY/ MRF No. (in 3 digits)]
                            Example: 02/ MUM/ CFR/ JAN/ 15/ 003  */
        private (string Reference, MrfLastNumber Number) GenerateMrfReferenceNumber(MrfdetailRequestModel request)
        {
            string Reference = string.Empty;
            _logger.LogInfo("Fetching All MRF Details");
            MrfLastNumber Number = _unitOfWork.MrfLastNo.Get(u => u.Id == 1);

            if (Number == null)
            {
                _logger.LogError("No record is found");
            }

            Locationmaster locationmaster = _unitOfWork.Locationmaster.Get(u => u.Id == request.LocationId);
            string month = request.CreatedOnUtc.ToString("MMM").ToUpper();
            string Year = request.CreatedOnUtc.ToString("yy");
            string RequisitionType = request.RequisitionType;

            Reference = request.VacancyNo.ToString("D2") + "/" + locationmaster.ShortCode + "/" + RequisitionType + "/" + month + "/" + Year + "/"
                + (Number.LastNumber++).ToString("D3");

            return (Reference, Number);
        }

        // GET: api/<ProjectController>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<SwaggerResponseDTO>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO GetMRFDropdownlist()
        {
            _logger.LogInfo("Fetching create MRF Dropdown list");
            SwaggerResponseDTO sw = new SwaggerResponseDTO();
            sw.Position = _unitOfWork.PositionTitlemaster.GetAll().OrderByDescending(Position => Position.CreatedOnUtc)
                    .ToList(); ;
            sw.Projects = _unitOfWork.Projectmaster.GetAll()
                    .OrderByDescending(project => project.CreatedOnUtc)
                    .ToList();
            sw.Departments = _unitOfWork.Departmentmaster.GetAll().ToList();
            sw.Grades = _unitOfWork.Grademaster.GetAll().ToList();
            sw.Vaccancies = _unitOfWork.Vacancytypemaster.GetAll().ToList();
            sw.EmploymentTypes = _unitOfWork.Employmenttypemaster.GetAll().ToList();
            sw.location = _unitOfWork.Locationmaster.GetAll().ToList();
            sw.Qualification = _unitOfWork.Qualificationmaster.GetAll().ToList();
            sw.ReportingTo = _unitOfWork.Employeedetails.GetAll().ToList();
            sw.Resumereviewer = _unitOfWork.Employeerolemap.GetEmployeebyRole(5);
            sw.InterviewReviewer = _unitOfWork.Employeerolemap.GetEmployeebyRole(6);
            sw.HiringManager = _unitOfWork.Employeerolemap.GetEmployeebyRole(3); // by default MRF owner
            sw.FunctionHead = _unitOfWork.Employeerolemap.GetEmployeebyRole(8);
            sw.SiteHRSPOC = _unitOfWork.Employeerolemap.GetEmployeebyRole(4);
            sw.FinanceHead = _unitOfWork.Employeerolemap.GetEmployeebyRole(10);
            sw.PresidentnCOO = _unitOfWork.Employeerolemap.GetEmployeebyRole(11);
            if (sw.Projects.Count == 0 || sw.Departments.Count == 0 || sw.Grades.Count == 0 || sw.Vaccancies.Count == 0 || sw.EmploymentTypes.Count == 0 || sw.location.Count == 0 || sw.Qualification.Count == 0 || sw.ReportingTo.Count == 0)
            {
                _logger.LogError("No record is found");
            }
            var combinedData = new
            {
                sw.Position,
                sw.Projects,
                sw.Departments,
                sw.Grades,
                sw.Vaccancies,
                sw.EmploymentTypes,
                sw.location,
                sw.Qualification,
                sw.ReportingTo,
                sw.Resumereviewer,
                sw.InterviewReviewer,
                sw.HiringManager,
                sw.FunctionHead,
                sw.SiteHRSPOC,
                sw.FinanceHead,
                sw.PresidentnCOO
            };

            int Count = sw.Projects.Count + sw.Departments.Count + sw.Grades.Count + sw.Vaccancies.Count + sw.EmploymentTypes.Count + sw.location.Count + sw.Qualification.Count + sw.ReportingTo.Count;
            _response.Result = combinedData;
            _response.Count = Count;
            _logger.LogInfo($"Total MRF Dropdown list  count: {Count}");
            return _response;
        }

        public class SwaggerResponseDTO
        {
            public List<PositionTitlemaster> Position { get; set; } = new List<PositionTitlemaster>();
            public List<Projectmaster> Projects { get; set; } = new List<Projectmaster>();
            public List<Departmentmaster> Departments { get; set; } = new List<Departmentmaster>();
            public List<Grademaster> Grades { get; set; } = new List<Grademaster>();
            public List<Vacancytypemaster> Vaccancies { get; set; } = new List<Vacancytypemaster>();
            public List<Employmenttypemaster> EmploymentTypes { get; set; } = new List<Employmenttypemaster>();
            public List<Locationmaster> location { get; set; } = new List<Locationmaster>();
            public List<Qualificationmaster> Qualification { get; set; } = new List<Qualificationmaster>();
            public List<Employeedetails> ReportingTo { get; set; } = new List<Employeedetails>();
            public List<Employeerolemap> Resumereviewer { get; set; } = new List<Employeerolemap>();//5
            public List<Employeerolemap> InterviewReviewer { get; set; } = new List<Employeerolemap>();//6
            public List<Employeerolemap> HiringManager { get; set; } = new List<Employeerolemap>();//3
            public List<Employeerolemap> FunctionHead { get; set; } = new List<Employeerolemap>();//8
            public List<Employeerolemap> SiteHRSPOC { get; set; } = new List<Employeerolemap>();//4
            public List<Employeerolemap> FinanceHead { get; set; } = new List<Employeerolemap>();//10
            public List<Employeerolemap> PresidentnCOO { get; set; } = new List<Employeerolemap>();//11
        }
    }
}