﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using MRF.Utility;
using Swashbuckle.AspNetCore.Annotations;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]    
    public class MrffeedbackController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private ResponseDTO _response;
        private MrffeedbackResponseModel _responseModel;
        private readonly ILoggerService _logger;
        private string mrfUrl = string.Empty;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IHostEnvironment _hostEnvironment;
        public MrffeedbackController(IUnitOfWork unitOfWork, ILoggerService logger, IEmailService emailService, IHostEnvironment hostEnvironment, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _response = new ResponseDTO();
            _responseModel = new MrffeedbackResponseModel();
            _logger = logger;
            _configuration = configuration;
            _emailService = emailService;
            _hostEnvironment = hostEnvironment;
 
        }
        // GET: api/<MrffeedbackController>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Mrffeedback>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get()
        {
            _logger.LogInfo("Fetching All MRF Feedback");
            List<Mrffeedback> mrfFeedBackList = _unitOfWork.Mrffeedback.GetAll().ToList();
            if (mrfFeedBackList.Count == 0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = mrfFeedBackList;
            _response.Count=mrfFeedBackList.Count;
            _logger.LogInfo($"Total mrf feedback  count: {mrfFeedBackList.Count}");
            return _response;
        }

        // GET api/<MrffeedbackController>/5
        [HttpGet("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(Mrffeedback))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get(int id)
        {
            _logger.LogInfo($"Fetching All MRF Feedback by Id: {id}");
            Mrffeedback mrfFeedBack = _unitOfWork.Mrffeedback.Get(u => u.Id == id);
            if (mrfFeedBack == null)
            {
                _logger.LogError($"No result found by this Id:{id}");
            }
            _response.Result = mrfFeedBack;
            return _response;
        }

        // POST api/<MrffeedbackController>
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, Description = "Item created successfully", Type = typeof(MrffeedbackResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrffeedbackResponseModel Post([FromBody] MrffeedbackRequestModel request)
        {
            var mrffeedback = new Mrffeedback
            {
                MrfId = request.MrfId,
                Feedback = request.Feedback,
                FeedbackByEmployeeId = request.FeedbackByEmployeeId,
                CreatedOnUtc = request.CreatedOnUtc,
                UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                UpdatedOnUtc = request.UpdatedOnUtc
            };

            _unitOfWork.Mrffeedback.Add(mrffeedback);
            _unitOfWork.Save();
            _responseModel.Id = mrffeedback.Id;
            if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
            {
                emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "Feedback Submission");

                Mrfdetails mrfdetail = _unitOfWork.Mrfdetail.Get(u => u.Id == request.MrfId);
                mrfUrl = _configuration["MRFUrl"].Replace("ID", mrfdetail.Id.ToString());
                string emailContent = emailRequest.Content.Replace("click here", $"<span style='color:blue; font-weight:bold; text-decoration:underline;'><a href='{mrfUrl}'>click here</a></span>");
                if (emailRequest != null)
                {  
                    _emailService.SendEmailAsync(emailRequest.emailTo, emailRequest.Subject, emailContent);
                }

                List<int> RoleIds = new List<int>();
                RoleIds = emailRequest.roleId.Split(',').Select(int.Parse).ToList();
                List<EmailRecipient> mrfFeedbackEmailList = _unitOfWork.EmailRecipient.GetEmployeeEmailByRoleIds(RoleIds, request.MrfId);

                foreach (var emailReq in mrfFeedbackEmailList)
                {   
                    _emailService.SendEmailAsync(emailReq.Email, emailRequest.Subject, emailContent);
                }
            }
            return _responseModel;
        }

        // PUT api/<MrffeedbackController>/5
        [HttpPut("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item updated successfully", Type = typeof(MrffeedbackResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful update)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public MrffeedbackResponseModel Put(int id, [FromBody] MrffeedbackRequestModel request)
        {
            var existingStatus = _unitOfWork.Mrffeedback.Get(u => u.Id == id);

            if (existingStatus != null)
            {
                existingStatus.MrfId = request.MrfId;
                existingStatus.Feedback = request.Feedback;
                existingStatus.FeedbackByEmployeeId = request.FeedbackByEmployeeId;
                existingStatus.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                existingStatus.UpdatedOnUtc = request.UpdatedOnUtc;

                _unitOfWork.Mrffeedback.Update(existingStatus);
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

        // DELETE api/<MrffeedbackController>/5
        [HttpDelete("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item deleted successfully", Type = typeof(MrffeedbackResponseModel))]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful deletion)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public void Delete(int id)
        {
            Mrffeedback? obj = _unitOfWork.Mrffeedback.Get(u => u.Id == id);
            if (obj != null)
            {
                _unitOfWork.Mrffeedback.Remove(obj);
                _unitOfWork.Save();

            }
            else {
                _logger.LogError($"No result found by this Id: {id}");
            }
           
        }
    }
}
