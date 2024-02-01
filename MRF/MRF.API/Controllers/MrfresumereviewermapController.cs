using Microsoft.AspNetCore.Mvc;
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
    public class MrfresumereviewermapController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private ResponseDTO _response;
        private MrfresumereviewermapResponseModel _responseModel;
        private readonly ILoggerService _logger;
        private readonly ISmtpEmailService _emailService;
        private readonly IHostEnvironment _hostEnvironment;
        public MrfresumereviewermapController(IUnitOfWork unitOfWork, ILoggerService logger, ISmtpEmailService emailService, IHostEnvironment hostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _response = new ResponseDTO();
            _responseModel = new MrfresumereviewermapResponseModel();
            _logger = logger;
            _emailService = emailService;
            _hostEnvironment = hostEnvironment;
        }
        // GET: api/<MrfresumereviewermapController>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Mrfresumereviewermap>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get()
        {
            _logger.LogInfo("Fetching All Mrf resume reviewer map");
            List<Mrfresumereviewermap> mrfresumereviewermapList = _unitOfWork.Mrfresumereviewermap.GetAll().ToList();
            if (mrfresumereviewermapList.Count ==  0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = mrfresumereviewermapList;
            _response.Count = mrfresumereviewermapList.Count;
            _logger.LogInfo($"Total Mrf resume reviewer map count: {mrfresumereviewermapList.Count}");
            return _response;
        }

        // GET api/<MrfresumereviewermapController>/5
        [HttpGet("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(Mrfresumereviewermap))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get(int id)
        {
            _logger.LogInfo($"Fetching All Mrf resume reviewer map by Id: {id}");
            Mrfresumereviewermap mrfresumereviewermap = _unitOfWork.Mrfresumereviewermap.Get(u => u.Id == id);
            if (mrfresumereviewermap == null)
            {
                _logger.LogError($"No result found by this Id:{id}");
            }
            _response.Result = mrfresumereviewermap;
            return _response;
        }
     
        // POST api/<MrfresumereviewermapController>
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, Description = "Item created successfully", Type = typeof(MrfresumereviewermapResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrfresumereviewermapResponseModel Post([FromBody] MrfresumereviewermapRequestModel request)
        {
            var mrfresumereviewermap = new Mrfresumereviewermap
            {
                MrfId = request.MrfId,
                ResumeReviewerEmployeeId = request.ResumeReviewerEmployeeId,
                IsActive = request.IsActive,
                CreatedByEmployeeId = request.CreatedByEmployeeId,
                CreatedOnUtc = request.CreatedOnUtc,
                UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                UpdatedOnUtc = request.UpdatedOnUtc
            };

            _unitOfWork.Mrfresumereviewermap.Add(mrfresumereviewermap);
            _unitOfWork.Save();
            _responseModel.Id = mrfresumereviewermap.Id;
            if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
            {
                emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "Resume Reviewer added");
                if (emailRequest != null)
                {
                    _emailService.SendEmail(emailRequest.emailTo, emailRequest.Subject, emailRequest.Content);
                }
            }
            return _responseModel;
        }

        // PUT api/<MrfresumereviewermapController>/5
        [HttpPut("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item updated successfully", Type = typeof(MrfresumereviewermapResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful update)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrfresumereviewermapResponseModel Put(int id, [FromBody] MrfresumereviewermapRequestModel request)
        {
            var existingStatus = _unitOfWork.Mrfresumereviewermap.Get(u => u.Id == id);

            if (existingStatus != null)
            {
                existingStatus.MrfId = request.MrfId;
                existingStatus.ResumeReviewerEmployeeId = request.ResumeReviewerEmployeeId;
                existingStatus.IsActive = request.IsActive;
                existingStatus.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                existingStatus.UpdatedOnUtc = request.UpdatedOnUtc;

                _unitOfWork.Mrfresumereviewermap.Update(existingStatus);
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

        // DELETE api/<MrfresumereviewermapController>/5
        [HttpDelete("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item deleted successfully", Type = typeof(MrfresumereviewermapResponseModel))]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful deletion)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public void Delete(int id)
        {
            Mrfresumereviewermap? obj = _unitOfWork.Mrfresumereviewermap.Get(u => u.Id == id);
            if (obj != null)
            {
                _unitOfWork.Mrfresumereviewermap.Remove(obj);
                _unitOfWork.Save();
                if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
                {
                    emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "Resume Reviewer deleted");
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

        public void DeletebyMRFId(int id)
        {
            Mrfresumereviewermap? obj = _unitOfWork.Mrfresumereviewermap.Get(u => u.MrfId == id);
            if (obj != null)
            {
                _unitOfWork.Mrfresumereviewermap.Remove(obj);
                _unitOfWork.Save();
                if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
                {
                    emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "Resume Reviewer deleted");
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

        // GET api/<MrfresumereviewermapController>/5
        [HttpGet("GetResumeStatusDetails")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(ResumeDetailsViewModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO GetResumeStatusDetails(int id,bool DashBoard,int roleId,int userId)
        {
            _logger.LogInfo($"Fetching All Mrf resume reviewer map by Id: {id}");
            List<ResumeDetailsViewModel> ResumeDetails = _unitOfWork.ResumeDetail.GetResumeStatusDetails(id, roleId, userId);
            if (ResumeDetails == null)
            {
                _logger.LogError($"No result found by this Id: {id}");
            }
            else {
                if (DashBoard)
                {

                    CombinedResponseDTO combinedResult = new CombinedResponseDTO
                    {
                        ResumeDetails = ResumeDetails,
                        EmployeeRoleMap = _unitOfWork.Employeerolemap.GetEmployeebyRole(5),
                    };
                    _response.Result = combinedResult;
                }
                else
                {
                    _response.Result = ResumeDetails;
                }
               
            }
            return _response;

        }

        public class CombinedResponseDTO
        {
            public List<ResumeDetailsViewModel> ResumeDetails { get; set; }
            public List<Employeerolemap> EmployeeRoleMap { get; set; }
        }



    }
}
