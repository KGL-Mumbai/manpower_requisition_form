using Microsoft.AspNetCore.Mvc;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using MRF.Models.ViewModels;
using MRF.Utility;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MRF.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MrfinterviewermapController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private ResponseDTO _response;
        private MrfinterviewermapResponseModel _responseModel;
        private readonly ILoggerService _logger;
        private readonly ISmtpEmailService _emailService;
        private readonly IHostEnvironment _hostEnvironment;
        public MrfinterviewermapController(IUnitOfWork unitOfWork, ILoggerService logger, ISmtpEmailService emailService, IHostEnvironment hostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _response = new ResponseDTO();
            _responseModel = new MrfinterviewermapResponseModel();
            _logger = logger;
            _emailService = emailService;
            _hostEnvironment = hostEnvironment;
        }
        
        
        // GET: api/<MrfinterviewermapController>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Mrfinterviewermap>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get()
        {
            _logger.LogInfo("Fetching All Mrf Interviewer Map");
            List<Mrfinterviewermap> mrfinterviewermapList = _unitOfWork.Mrfinterviewermap.GetAll().ToList();
            if (mrfinterviewermapList.Count == 0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = mrfinterviewermapList;
            _response.Count=mrfinterviewermapList.Count;
            _logger.LogInfo($"Total Mrf Interviewer Map count: {mrfinterviewermapList.Count}");
            return _response;
        }

        // GET api/<MrfinterviewermapController>/5
        [HttpGet("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(Mrfinterviewermap))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get(int id)
        {
            _logger.LogInfo($"Fetching All Mrf Interviewer Map by Id: {id}");
            Mrfinterviewermap  mrfinterviewermap = _unitOfWork.Mrfinterviewermap.Get(u => u.Id == id);
            if (mrfinterviewermap == null)
            {
                _logger.LogError($"No result found by this Id:{id}");
            }
            _response.Result = mrfinterviewermap;
            return _response;
        }

        // POST api/<MrfinterviewermapController>
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, Description = "Item created successfully", Type = typeof(MrfinterviewermapResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrfinterviewermapResponseModel Post([FromBody] MrfinterviewermapRequestModel request)
        {
            var mrfinterviewermap = new Mrfinterviewermap
            {
                MrfId = request.MrfId,
                InterviewerEmployeeId = request.InterviewerEmployeeId,
                IsActive = request.IsActive,
                CreatedByEmployeeId = request.CreatedByEmployeeId,
                CreatedOnUtc = request.CreatedOnUtc,
                UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                UpdatedOnUtc = request.UpdatedOnUtc
            };

            _unitOfWork.Mrfinterviewermap.Add(mrfinterviewermap);
            _unitOfWork.Save();
            _responseModel.Id = mrfinterviewermap.Id;
            if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
            {
                emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "Interviewer added");
                if (emailRequest != null)
                {
                    _emailService.SendEmail(emailRequest.emailTo, emailRequest.Subject, emailRequest.Content);
                }
            }
           
            return _responseModel;
        }

        // PUT api/<MrfinterviewermapController>/5
        [HttpPut("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item updated successfully", Type = typeof(MrfinterviewermapResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful update)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrfinterviewermapResponseModel Put(int id, [FromBody] MrfinterviewermapRequestModel request)
        {
            var existingStatus = _unitOfWork.Mrfinterviewermap.Get(u => u.Id == id);

            if (existingStatus != null)
            {
                existingStatus.MrfId = request.MrfId;
                existingStatus.InterviewerEmployeeId = request.InterviewerEmployeeId;
                existingStatus.IsActive = request.IsActive;
                existingStatus.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                existingStatus.UpdatedOnUtc = request.UpdatedOnUtc;

                _unitOfWork.Mrfinterviewermap.Update(existingStatus);
                _unitOfWork.Save();

                _responseModel.Id = existingStatus.Id;
            }
            else
            {
                _logger.LogError($"No result found by this Id: {id}");
                _responseModel.Id = 0;                
            }
            return _responseModel;
        }

        // DELETE api/<MrfinterviewermapController>/5
        [HttpDelete("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item deleted successfully", Type = typeof(MrfinterviewermapResponseModel))]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful deletion)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public void Delete(int id)
        {
            Mrfinterviewermap? obj = _unitOfWork.Mrfinterviewermap.Get(u => u.Id == id);
            if (obj != null)
            {
                _unitOfWork.Mrfinterviewermap.Remove(obj);
                _unitOfWork.Save();
                if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
                {
                    emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "Interviewer deleted");
                    if (emailRequest != null)
                    {
                        _emailService.SendEmail(emailRequest.emailTo, emailRequest.Subject, emailRequest.Content);
                    }
                }

            }
            else {
                _logger.LogError($"No result found by this Id: {id}");
            }
            
        }
        // DELETE api/<MrfinterviewermapController>/5
        [HttpDelete("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item deleted successfully", Type = typeof(MrfinterviewermapResponseModel))]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful deletion)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]

        public void DeleteMRFInterview(int id)
        {
            Mrfinterviewermap? obj = _unitOfWork.Mrfinterviewermap.Get(u => u.MrfId == id);

            if (obj != null)
            {
                _unitOfWork.Mrfinterviewermap.Remove(obj);
                _unitOfWork.Save();
                if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
                {
                    emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "Interviewer deleted");
                    if (emailRequest != null)
                    {
                        _emailService.SendEmail(emailRequest.emailTo, emailRequest.Subject, emailRequest.Content);
                    }
                }

            }
            else
            {
                _logger.LogError($"No result found by this Id: {id}");
            }

        }


        // GET api/<MrfinterviewermapController>/5
        [HttpGet("GetInterviewDetails")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(InterviewDetailsViewModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO GetInterviewDetails(int id, bool DashBoard,int roleId,int userId)
        {
            _logger.LogInfo($"Fetching All Mrf Interviewer Map by Id: {id}");
            List<InterviewDetailsViewModel> InterviewDetails = _unitOfWork.InterviewDetail.GetInterviewDetails(id, roleId, userId);
            if (InterviewDetails == null)
            {
                _logger.LogError($"No result found by this Id: {id}");
            }
            else
            {
                if (DashBoard)
                {

                    CombinedResponseDTO combinedResult = new CombinedResponseDTO
                    {
                        InterviewDetails = InterviewDetails,
                        Interviewstatus = _unitOfWork.Evaluationstatusmaster.GetStatus(),
                        InterviewReviewer = _unitOfWork.Employeerolemap.GetEmployeebyRole(6),
                    };
                    _response.Result = combinedResult;
                }
                else
                {
                    _response.Result = InterviewDetails;
                }

            }
            return _response;
        }

        public class CombinedResponseDTO
        {
            public List<InterviewDetailsViewModel> InterviewDetails { get; set; }= new List<InterviewDetailsViewModel> { };
            public List<Interviewstatus> Interviewstatus { get; set; } = new List<Interviewstatus> { };
            public List<Employeerolemap> InterviewReviewer { get; set; } = new List<Employeerolemap>();
    }

    }
}
