using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using MRF.Models.ViewModels;
using MRF.Utility;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Immutable;
using System.Drawing;
using System.Xml.Linq;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;

namespace MRF.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CandidatedetailController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private ResponseDTO _response;
        private CandidatedetailResponseModel _responseModel;
        private readonly ILoggerService _logger;
        private readonly ISmtpEmailService _emailService;
        private readonly IHostEnvironment _hostEnvironment;
        public CandidatedetailController(IUnitOfWork unitOfWork, ILoggerService logger, ISmtpEmailService emailService, IHostEnvironment hostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _response = new ResponseDTO();
            _responseModel = new CandidatedetailResponseModel();
            _logger = logger;
            _emailService = emailService;
            _hostEnvironment = hostEnvironment;
        }

        // GET: api/<CandidatedetailController>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Candidatedetails>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get()
        {
            _logger.LogInfo("Fetching All Candidate detail");
            List<Candidatedetails> obj = _unitOfWork.Candidatedetail.GetAll().ToList();

            if (obj.Count == 0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = obj;
            _response.Count = obj.Count;
            _logger.LogInfo($"Total Candidate detail count: {_response.Count}");
            return _response;
        }

        // GET api/<CandidatedetailController>/5
        [HttpGet("{Id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(Candidatedetails))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get(int Id)
        {
            _logger.LogInfo($"Fetching  Candidate detail by Id: {Id}");
            Candidatedetails Candidatedetail = _unitOfWork.Candidatedetail.Get(u => u.Id == Id);
            if (Candidatedetail == null)
            {

                _logger.LogError("No result found by this Id:" + Id);
            }
            _response.Result = Candidatedetail;

            return _response;
        }

        // POST api/<CandidatedetailController>
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, Description = "Item created successfully", Type = typeof(CandidatedetailResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public CandidatedetailResponseModel Post([FromBody] CandidatedetailRequestModel request)
        {
            var existingCandidate = _unitOfWork.Candidatedetail
           .Get(u => u.MrfId == request.MrfId && u.Name != null && u.Name.ToLower().Replace(" ", "") == request.Name.ToLower().Replace(" ", ""));
            
             
            if (existingCandidate == null)

            {
                List<Mrfresumereviewermap> mrfresumereviewermap = _unitOfWork.Mrfresumereviewermap.GetA(u => u.MrfId == request.MrfId).ToList();
                string reviewerEmpId="";
                if (mrfresumereviewermap.Count > 0)
                {
                     reviewerEmpId = string.Join(",", mrfresumereviewermap.Select(r => r.ResumeReviewerEmployeeId).Distinct());

                }
                var Candidatedetail = new Candidatedetails {
                    Name = request.Name,
                    MrfId = request.MrfId,
                    EmailId = request.EmailId,
                    ContactNo = request.ContactNo,
                 ResumePath = request.ResumePath,
                 ReviewedByEmployeeIds = reviewerEmpId,
                 CandidateStatusId = request.CandidateStatusId,
                 CreatedByEmployeeId = request.CreatedByEmployeeId,
                 Reason = request.Reason,
                SourceId = request.SourceId,
                 CreatedOnUtc = request.CreatedOnUtc,
                 UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                 UpdatedOnUtc = request.UpdatedOnUtc,

            };
               



                    _unitOfWork.Candidatedetail.Add(Candidatedetail);
                    _unitOfWork.Save();
                List<Mrfinterviewermap> mrfinterviewermap = _unitOfWork.Mrfinterviewermap.GetA(u => u.MrfId == Candidatedetail.MrfId).ToList();
                if (mrfinterviewermap.Count > 0)
                {
                    string interviewerId = string.Join(",", mrfinterviewermap.Select(r => r.InterviewerEmployeeId).Distinct());
                    var interviewevaluation = new InterviewevaluationRequestModel
                    {
                        CandidateId = Candidatedetail.Id,
                        CreatedByEmployeeId = request.CreatedByEmployeeId,
                        CreatedOnUtc = request.CreatedOnUtc,
                        EvalutionStatusId = 0,
                        FromTimeUtc = TimeOnly.FromDateTime(DateTime.Now),
                        interviewerEmployeeIds = interviewerId,
                        ToTimeUtc = TimeOnly.FromDateTime(DateTime.Now),
                        UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                        UpdatedOnUtc = request.UpdatedOnUtc,
                    };
                    InterviewevaluationController controller = new InterviewevaluationController(_unitOfWork, _logger);

                    controller.Post(interviewevaluation);
                    _responseModel.Id = Candidatedetail.Id;
                    _responseModel.IsActive = true;
                }
            }
            else { _responseModel.Id = -1; }
                return _responseModel;
            }
        
        
            // PUT api/<CandidatedetailController>/5

            [HttpPut("{id}")]
            [SwaggerResponse(StatusCodes.Status200OK, Description = "Item updated successfully", Type = typeof(CandidatedetailResponseModel))]
            [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
            [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful update)")]
            [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
            [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
            [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
            [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
            [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
            [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
            [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
            public CandidatedetailResponseModel Put(int id, [FromBody] CandidatedetailRequestModel request)
            {

                var existingDetails = _unitOfWork.Candidatedetail.Get(u => u.Id == id);
                if (existingDetails != null)
                {
                    if (request.ReviewedByEmployeeIds != "")
                    {
                        existingDetails.ReviewedByEmployeeIds = request.ReviewedByEmployeeIds;
                        existingDetails.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                        existingDetails.UpdatedOnUtc = request.UpdatedOnUtc;

                    }
                    // existingDetails.Name = request.Name;
                    existingDetails.Name = request.Name == "string" ? existingDetails.Name : request.Name;

                    existingDetails.EmailId = request.EmailId == "string" ? existingDetails.EmailId : request.EmailId;
                     existingDetails.ContactNo = request.ContactNo == "string" ? existingDetails.ContactNo : request.ContactNo;
                existingDetails.ResumePath = request.ResumePath;
                    existingDetails.ReviewedByEmployeeIds = request.ReviewedByEmployeeIds;
                    existingDetails.CandidateStatusId = request.CandidateStatusId;
                    existingDetails.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                    existingDetails.UpdatedOnUtc = request.UpdatedOnUtc;
                    existingDetails.Reason = request.Reason;

                    _unitOfWork.Candidatedetail.Update(existingDetails);
                    _unitOfWork.Save();
                    _responseModel.Id = existingDetails.Id;
                    _responseModel.IsActive = true;

                }
                if (_responseModel.Id != 0)
                {
                    CallResumeForwarddetailsController(request, _responseModel.Id);
                }


                else
                {
                    _logger.LogError($"No result found by this Id: {id}");
                    _responseModel.Id = 0;
                    _responseModel.IsActive = false;
                }

                return _responseModel;
            }

            private void CallResumeForwarddetailsController(CandidatedetailRequestModel request, int id)
            {
                List<Resumeforwarddetails> resumeforwarddetails = _unitOfWork.Resumeforwarddetail.GetEmployeeByCandidateid(id);
                ResumeforwarddetailController interviewermap = new ResumeforwarddetailController(_unitOfWork, _logger, _emailService, _hostEnvironment);
                if (resumeforwarddetails != null)
                {
                    foreach (Resumeforwarddetails resumeforward in resumeforwarddetails)
                    {
                        interviewermap.Delete(resumeforward.Id);
                    }

                    if (!string.IsNullOrEmpty(request.ReviewedByEmployeeIds))
                    {
                        var employeeIds = request.ReviewedByEmployeeIds.Split(',');
                        foreach (var employeeId in employeeIds)
                        {


                            var forwardResume = new ResumeforwarddetailRequestModel
                            {
                                CandidateId = id,
                                ForwardedToEmployeeId = int.Parse(employeeId),
                                // as we discussed with ashutosh we are adding ForwardedFromEmployeeId as a 1
                                ForwardedFromEmployeeId = 1,


                            };
                            var interviewermapResponse = interviewermap.Post(forwardResume);

                        }




                    }
                }
            }

            // DELETE api/<CandidatedetailController>/5
            [HttpDelete("{Id}")]
            [SwaggerResponse(StatusCodes.Status200OK, Description = "Item deleted successfully", Type = typeof(CandidatedetailResponseModel))]
            [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful deletion)")]
            [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
            [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
            [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
            [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
            [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
            [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
            public void Delete(int Id)
            {

                Candidatedetails? obj = _unitOfWork.Candidatedetail.Get(u => u.Id == Id);
                if (obj != null)
                {
                    _unitOfWork.Candidatedetail.Remove(obj);
                    _unitOfWork.Save();
                }
                else
                {
                    _logger.LogError($"No result found by this Id: {Id}");
                }


            }

            [HttpGet]
            [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<CanditeResponseDTO>))]
            [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
            [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
            [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
            [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
            [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
            [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
            public ResponseDTO GetResumeDropdownlist(int id, int roleId, int userId)
            {
                _logger.LogInfo("Fetching create MRF Dropdown list");
                // List<Candidatedetails> obj = _unitOfWork.Candidatedetail.GetForwardedTodata();
                List<ResumeDetailsViewModel> ResumeDetails = _unitOfWork.ResumeDetail.GetResumeStatusDetails(id, roleId, userId);
                CanditeResponseDTO sw = new CanditeResponseDTO();


                sw.Resumereviewer = _unitOfWork.Employeerolemap.GetEmployeebyRole(5);
                sw.status = _unitOfWork.Candidatestatusmaster.GetCandidatesByResumestatus().ToList();
                var combinedData = new
                {

                    CandidateDetails = ResumeDetails,
                    sw.Resumereviewer,
                    sw.status

                };

                int Count = 2;


                _response.Result = combinedData;
                _response.Count = Count;
                //_logger.LogInfo($"Total MRF Dropdown list  count: {Count}");
                return _response;
            }
            [HttpGet]
            [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<CandidatedetailRequestModel>))]
            [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
            [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
            [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
            [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
            [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
            [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
            public ResponseDTO GetReferenceNoAndPositiontitle()
            {
                _logger.LogInfo("Fetching All Candidate detail");
                List<CandidatedetailRequestModel> obj = _unitOfWork.Candidatedetail.GetReferenceNoAndPositiontitle();

                if (obj.Count == 0)
                {
                    _logger.LogError("No record is found");
                }
                _response.Result = obj;
                _response.Count = obj.Count;
                _logger.LogInfo($"Total Candidate detail count: {_response.Count}");
                return _response;
            }

        public class CanditeResponseDTO
        {
            public List<Candidatedetails> CandidateDetails { get; set; }
            public List<Employeerolemap> Resumereviewer { get; set; } = new List<Employeerolemap>();//5
            public List<Candidatestatusmaster> status { get; set; } = new List<Candidatestatusmaster>();

        }





    }
}

