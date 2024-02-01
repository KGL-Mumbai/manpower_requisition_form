using Microsoft.AspNetCore.Mvc;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using MRF.Utility;
using Swashbuckle.AspNetCore.Annotations;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeforwarddetailController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private ResponseDTO _response;
        private ResumeforwarddetailResponseModel _responseModel;
        private readonly ILoggerService _logger;
        private readonly ISmtpEmailService _emailService;
        private readonly IHostEnvironment _hostEnvironment;
        public ResumeforwarddetailController(IUnitOfWork unitOfWork, ILoggerService logger, ISmtpEmailService emailService, IHostEnvironment hostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _response = new ResponseDTO();
            _responseModel = new ResumeforwarddetailResponseModel();
            _logger = logger;
            _emailService = emailService;
            _hostEnvironment = hostEnvironment;
        }

        // GET: api/<ResumeforwarddetailController>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Resumeforwarddetails>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get()
        {
            _logger.LogInfo("Fetching All Resume forward detail");
            List<Resumeforwarddetails> resumeforwarddetailList = _unitOfWork.Resumeforwarddetail.GetAll().ToList();
            if (resumeforwarddetailList.Count ==  0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = resumeforwarddetailList;
            _response.Count = resumeforwarddetailList.Count;
            _logger.LogInfo($"Total  Resume forward detail count: {resumeforwarddetailList.Count}");
            return _response;
        }

        // GET api/<ResumeforwarddetailController>/5
        [HttpGet("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(Resumeforwarddetails))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get(int id)
        {
            _logger.LogInfo($"Fetching All Resume forward detail by Id: {id}");
            Resumeforwarddetails  resumeforwarddetail = _unitOfWork.Resumeforwarddetail.Get(u => u.Id == id);
            if (resumeforwarddetail == null)
            {
                _logger.LogError($"No result found by this Id:{id}");
            }
            _response.Result = resumeforwarddetail;
            return _response;
        }

        // POST api/<ResumeforwarddetailController>
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, Description = "Item created successfully", Type = typeof(ResumeforwarddetailResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResumeforwarddetailResponseModel Post([FromBody] ResumeforwarddetailRequestModel request)
        {
            var resumeforwarddetail = new Resumeforwarddetails
            {
                CandidateId = request.CandidateId,
                ForwardedFromEmployeeId = request.ForwardedFromEmployeeId,
                ForwardedToEmployeeId = request.ForwardedToEmployeeId,
                ForwardedOnUtc = request.ForwardedOnUtc
            };

            _unitOfWork.Resumeforwarddetail.Add(resumeforwarddetail);
            _unitOfWork.Save();
            _responseModel.Id = resumeforwarddetail.Id;
            if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
            {
                emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "update MRF");
                if (emailRequest != null)
                {
                    _emailService.SendEmail(emailRequest.emailTo, emailRequest.Subject, emailRequest.Content);
                }
            }
            return _responseModel;
        }

        // PUT api/<ResumeforwarddetailController>/5
        [HttpPut("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item updated successfully", Type = typeof(ResumeforwarddetailResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful update)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResumeforwarddetailResponseModel Put(int id, [FromBody] ResumeforwarddetailRequestModel request)
        {
            var existingStatus = _unitOfWork.Resumeforwarddetail.Get(u => u.Id == id);

            if (existingStatus != null)
            {
                existingStatus.CandidateId = request.CandidateId;
                existingStatus.ForwardedFromEmployeeId = request.ForwardedFromEmployeeId;
                existingStatus.ForwardedToEmployeeId = request.ForwardedToEmployeeId;
                existingStatus.ForwardedOnUtc = request.ForwardedOnUtc;

                _unitOfWork.Resumeforwarddetail.Update(existingStatus);
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


        // DELETE api/<ResumeforwarddetailController>/5
        [HttpDelete("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item deleted successfully", Type = typeof(ResumeforwarddetailResponseModel))]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful deletion)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public void Delete(int id)
        {
            Resumeforwarddetails? obj = _unitOfWork.Resumeforwarddetail.Get(u => u.Id == id);
            if (obj != null)
            {
                _unitOfWork.Resumeforwarddetail.Remove(obj);
                _unitOfWork.Save();

            }
            else {
                _logger.LogError($"No result found by this Id: {id}");
            }
            
        }
    }
}
