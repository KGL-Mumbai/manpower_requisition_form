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
    public class InterviewevaluationController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private ResponseDTO _response;
        private InterviewevaluationResponseModel _responseModel;
        private readonly ILoggerService _logger;
        public InterviewevaluationController(IUnitOfWork unitOfWork, ILoggerService logger)
        {
            _unitOfWork = unitOfWork;
            _response = new ResponseDTO();
            _responseModel = new InterviewevaluationResponseModel();
            _logger = logger;
        }
        // GET: api/<InterviewevaluationController>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Interviewevaluation>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get()
        {
            _logger.LogInfo("Fetching All Candidate Status");
            List<Interviewevaluation> InterviewevaluationList = _unitOfWork.Interviewevaluation.GetAll().ToList();
            if (InterviewevaluationList == null)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = InterviewevaluationList;
            _logger.LogInfo($"Total candidate status count: {InterviewevaluationList.Count}");
            return _response;
        }

        // GET api/<InterviewevaluationController>/5
        [HttpGet("{Id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(Interviewevaluation))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get(int Id)
        {

            _logger.LogInfo($"Fetching All Candidate Status by Id: {Id}");
            Interviewevaluation interviewevaluation = _unitOfWork.Interviewevaluation.Get(u => u.Id == Id);
            if (interviewevaluation == null)
            {
                _logger.LogError($"No result found by this Id: {Id}");
            }
            _response.Result = interviewevaluation;
            return _response;
        }

        // POST api/<InterviewevaluationController>
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, Description = "Item created successfully", Type = typeof(InterviewevaluationResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public InterviewevaluationResponseModel Post([FromBody] InterviewevaluationRequestModel request)

        {
            var interviewevaluation = new Interviewevaluation();


            if (!string.IsNullOrEmpty(request.interviewerEmployeeIds))
            {

                List<Interviewevaluation>? obj = _unitOfWork.Interviewevaluation.GetCandidateByCandidateid(request.CandidateId);
                var employeeIds = request.interviewerEmployeeIds.Split(',');

                // Remove employeeIds which exist in obj but not in request.interviewerEmployeeIds
                var employeeIdsInObj = obj.Select(item => item.InterviewerId.ToString()).ToList();
                var employeeIdsToRemove = employeeIdsInObj.Except(employeeIds).Select(int.Parse).ToList();

                foreach (var employeeIdToRemove in employeeIdsToRemove)
                {
                    var itemToRemove = obj.FirstOrDefault(item => item.InterviewerId == employeeIdToRemove);
                    if (itemToRemove != null)
                    {
                        try
                        {
                            _unitOfWork.Interviewevaluation.Remove(itemToRemove);
                            _unitOfWork.Save();
                        }
                        catch (Exception ex)
                        {

                        }
                    }
                }

                foreach (var employeeId in employeeIds)
                {
                    bool employeeIdExists = obj.Any(item => item.InterviewerId == Convert.ToInt32(employeeId));
                    if (!employeeIdExists)
                    {
                        var interviewevaluation1 = new Interviewevaluation();
                        interviewevaluation1.InterviewerId = int.Parse(employeeId);
                        interviewevaluation1.CandidateId = request.CandidateId;
                        interviewevaluation1.EvalutionStatusId = request.EvalutionStatusId == 0 ? null : request.EvalutionStatusId;
                        interviewevaluation1.EvaluationDateUtc = request.EvaluationDateUtc;
                        interviewevaluation1.FromTimeUtc = request.FromTimeUtc;
                        interviewevaluation1.ToTimeUtc = request.ToTimeUtc;
                        interviewevaluation1.CreatedByEmployeeId = request.CreatedByEmployeeId;
                        interviewevaluation1.CreatedOnUtc = request.CreatedOnUtc;
                        interviewevaluation1.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                        interviewevaluation1.UpdatedOnUtc = request.UpdatedOnUtc;
                        _unitOfWork.Interviewevaluation.Add(interviewevaluation1);
                        _unitOfWork.Save();
                    }
                }
            }

            else
            {

                interviewevaluation.InterviewerId = request.InterviewerId;
                interviewevaluation.CandidateId = request.CandidateId;
                interviewevaluation.EvaluationDateUtc = request.EvaluationDateUtc;
                interviewevaluation.FromTimeUtc = request.FromTimeUtc;
                interviewevaluation.EvalutionStatusId = request.EvalutionStatusId;
                interviewevaluation.EvaluationDateUtc = request.EvaluationDateUtc;
                interviewevaluation.FromTimeUtc = request.FromTimeUtc;
                interviewevaluation.ToTimeUtc = request.ToTimeUtc;
                interviewevaluation.EvalutionStatusId = request.EvalutionStatusId;
                interviewevaluation.CreatedByEmployeeId = request.CreatedByEmployeeId;
                interviewevaluation.CreatedOnUtc = request.CreatedOnUtc;
                interviewevaluation.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                interviewevaluation.UpdatedOnUtc = request.UpdatedOnUtc;
                _unitOfWork.Interviewevaluation.Add(interviewevaluation);
                _unitOfWork.Save();

            }
            _responseModel.Id = interviewevaluation.Id;
            return _responseModel;
        }
        // PUT api/<InterviewevaluationController>/5
        [HttpPut("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item updated successfully", Type = typeof(InterviewevaluationResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful update)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public InterviewevaluationResponseModel Put(int id, [FromBody] InterviewevaluationRequestModel request)
        {

            List<Interviewevaluation> record = _unitOfWork.Interviewevaluation.GetA(u => u.CandidateId == request.CandidateId).ToList();
            InterviewevaluationHistoryController controller = new InterviewevaluationHistoryController(_unitOfWork, _logger);
            controller.PostForInterview(record);
            if (record.Count > 0)
            {
                for (int i = 0; i < record.Count; i++)
                {

                    var existingRecord = record[i];


                    if (existingRecord != null)
                    {
                        existingRecord.CandidateId = request.CandidateId == 0 ? existingRecord.CandidateId : request.CandidateId;
                        existingRecord.InterviewerId = request.InterviewerId == 0 ? existingRecord.InterviewerId : request.InterviewerId;
                        existingRecord.EvaluationDateUtc = request.EvaluationDateUtc == DateOnly.MinValue ? existingRecord.EvaluationDateUtc : request.EvaluationDateUtc;
                        existingRecord.FromTimeUtc = request.FromTimeUtc == TimeOnly.MinValue ? existingRecord.FromTimeUtc : request.FromTimeUtc;
                        existingRecord.ToTimeUtc = request.ToTimeUtc == TimeOnly.MinValue ? existingRecord.ToTimeUtc : request.ToTimeUtc;
                        existingRecord.EvalutionStatusId = request.EvalutionStatusId == 0 ? existingRecord.EvalutionStatusId : request.EvalutionStatusId;
                        existingRecord.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                        existingRecord.UpdatedOnUtc = request.UpdatedOnUtc;


                        _unitOfWork.Interviewevaluation.Update(existingRecord);
                        _unitOfWork.Save();

                        _responseModel.Id = existingRecord.Id;

                    }
                    else
                    {
                        _logger.LogError($"No result found by this Id: {id}");

                        _responseModel.Id = 0;
                        _responseModel.Status = null;
                        _responseModel.IsActive = false;
                    }
                }
            }
            else
            {
                Post(request);
            }

            return _responseModel;

        }

        // DELETE api/<InterviewevaluationController>/5
        [HttpDelete("{Id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item deleted successfully", Type = typeof(InterviewevaluationResponseModel))]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful deletion)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public void Delete(int Id)
        {
            Interviewevaluation? obj = _unitOfWork.Interviewevaluation.Get(u => u.Id == Id);
            if (obj == null)
            {
                _logger.LogError($"No result found by this Id: {Id}");
            }
            _unitOfWork.Interviewevaluation.Remove(obj);
            _unitOfWork.Save();
        }
    }
}
