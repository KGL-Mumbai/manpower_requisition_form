using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using MRF.Utility;
using Swashbuckle.AspNetCore.Annotations;
using System.Xml.Linq;

namespace MRF.API.Controllers
{
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AttachmentController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private ResponseDTO _response;
        private AttachmentEvaluationResponseModel _responseModel;
        private readonly ILoggerService _logger;
        private readonly ISmtpEmailService _emailService;
        public AttachmentController(IUnitOfWork unitOfWork, ILoggerService logger, ISmtpEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _response = new ResponseDTO();
            _responseModel = new AttachmentEvaluationResponseModel();
            _logger = logger;
            _emailService = emailService;
        }

        // GET: api/<AttachmentController>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<AttachmentEvaluation>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get()
        {
            _logger.LogInfo("Fetching All Candidate detail");
            List<AttachmentEvaluation> obj = _unitOfWork.AttachmentEvaluation.GetAll().ToList();

            if (obj.Count == 0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = obj;
            _response.Count = obj.Count;
            _logger.LogInfo($"Total Candidate detail count: {_response.Count}");            
            return _response;
        }

        // GET api/<AttachmentController>/5
        [HttpGet("{Id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(AttachmentEvaluation))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get(int Id)
        {
            _logger.LogInfo($"Fetching  Candidate detail by Id: {Id}");
            AttachmentEvaluation AttachmentEvaluation = _unitOfWork.AttachmentEvaluation.Get(u => u.Id == Id);
            if (AttachmentEvaluation == null)
            {

                _logger.LogError("No result found by this Id:" + Id);
            }
            _response.Result = AttachmentEvaluation;

            return _response;
        }

        // POST api/<AttachmentController>
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, Description = "Item created successfully", Type = typeof(CandidatedetailResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public AttachmentEvaluationResponseModel Post([FromBody] AttachmentEvaluationRequestModel request)
        {

            var AttachmentEvaluation = new AttachmentEvaluation
            {
                FilePath = request.FilePath,
                InterviewEvaluationId = request.InterviewEvaluationId,
                CreatedByEmployeeId = request.CreatedByEmployeeId,
                CreatedOnUtc = request.CreatedOnUtc,
                UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                UpdatedOnUtc = request.UpdatedOnUtc
            };

            _unitOfWork.AttachmentEvaluation.Add(AttachmentEvaluation);
            _unitOfWork.Save();

            _responseModel.Id = AttachmentEvaluation.Id;
            _responseModel.IsActive = true;


            return _responseModel;
        }

        // PUT api/<AttachmentController>/5
        [HttpPut("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item updated successfully", Type = typeof(AttachmentEvaluationResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful update)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public AttachmentEvaluationResponseModel Put(int id, [FromBody] AttachmentEvaluationRequestModel request)
        {

            var existingDetails = _unitOfWork.AttachmentEvaluation.Get(u => u.Id == id);
            if (existingDetails != null)
            {

                existingDetails.FilePath = request.FilePath;
                existingDetails.InterviewEvaluationId = request.InterviewEvaluationId;

                existingDetails.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                existingDetails.UpdatedOnUtc = request.UpdatedOnUtc;

                _unitOfWork.AttachmentEvaluation.Update(existingDetails);
                _unitOfWork.Save();
                _responseModel.Id = existingDetails.Id;
                _responseModel.IsActive = true;
            }
            else
            {
                _logger.LogError($"No result found by this Id: {id}");
                _responseModel.Id = 0;
                _responseModel.IsActive = false;
            }

            return _responseModel;
        }

        // DELETE api/<AttachmentController>/5
        [HttpDelete("{Id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item deleted successfully", Type = typeof(AttachmentEvaluationResponseModel))]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful deletion)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public void Delete(int Id)
        {

            AttachmentEvaluation? obj = _unitOfWork.AttachmentEvaluation.Get(u => u.Id == Id);
            if (obj != null)
            {
                _unitOfWork.AttachmentEvaluation.Remove(obj);
                _unitOfWork.Save();
            }
            else
            {
                _logger.LogError($"No result found by this Id: {Id}");
            }

        }
    }
}



