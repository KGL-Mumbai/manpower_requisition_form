using Microsoft.AspNetCore.Mvc;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using MRF.Utility;
using Swashbuckle.AspNetCore.Annotations;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
namespace MRF.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeedetailsController
    {
        private readonly IUnitOfWork _unitOfWork;
        private ResponseDTO _response;
        private EmployeedetailsResponseModel _responseModel;
        private readonly ILoggerService _logger;
        private readonly IEmailService _emailService;
        private readonly IHostEnvironment _hostEnvironment;

        public EmployeedetailsController(IUnitOfWork unitOfWork, ILoggerService logger, IEmailService emailService, IHostEnvironment hostEnvironment)

        {
            _unitOfWork = unitOfWork;
            _response = new ResponseDTO();
            _responseModel = new EmployeedetailsResponseModel();
            _logger = logger;

            _emailService = emailService;
            _hostEnvironment = hostEnvironment;


        }

        // GET: api/<EmployeedetailsController>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Employeedetails>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get()
        {
            _logger.LogInfo("Fetching All Employee details");
            List<Employeedetails> obj = _unitOfWork.Employeedetails.GetAll().ToList();
            _response.Result = obj;


            if (obj.Count == 0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = obj;
            _response.Count = obj.Count;
            _logger.LogInfo($"Total Employee count: {obj.Count}");
            return _response;


        }

        // GET api/<EmployeedetailsController>/5
        [HttpGet("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(Employeedetails))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO Get(int id)
        {
            _logger.LogInfo($"Fetching Employeedetails by Id: {id}");
            Employeedetails Employeedetail = _unitOfWork.Employeedetails.Get(u => u.Id == id);
            if (Employeedetail == null)
            {

                _logger.LogError("No result found by this Id:" + id);
            }
            _response.Result = Employeedetail;


            return _response;
        }

        // POST api/<EmployeedetailsController>
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, Description = "Item created successfully", Type = typeof(Employeedetails))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public EmployeedetailsResponseModel Post([FromBody] EmployeedetailsRequestModel request)
        {
            Employeedetails Employeedetail = _unitOfWork.Employeedetails.Get(u => u.Email == request.Email );
            if (Employeedetail == null)
            {
                var employeedetails = new Employeedetails
                {
                    Name = request.Name,
                    Email = request.Email,
                    ContactNo = request.ContactNo,
                    RoleId = request.RoleId,
                    EmployeeCode = request.EmployeeCode,
                    IsAllowed = request.IsAllowed,
                    AllowedByEmployeeId = request.AllowedByEmployeeId,
                    CreatedByEmployeeId = request.CreatedByEmployeeId,
                    CreatedOnUtc = request.CreatedOnUtc,
                    UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                    UpdatedOnUtc = request.UpdatedOnUtc
                };
                _unitOfWork.Employeedetails.Add(employeedetails);
                _unitOfWork.Save();
                _responseModel.Id = employeedetails.Id;


                if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
                {

                    emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "Create User");

                    List<int> RoleIds = new List<int>();
                    RoleIds = emailRequest.roleId.Split(',').Select(int.Parse).ToList();
                    List<EmailRecipient> mrfUserList = _unitOfWork.EmailRecipient.GetEmployeeEmailByRoleIds(RoleIds);
                    if (emailRequest != null)
                    {   
                        _emailService.SendEmailAsync(emailRequest.emailTo, emailRequest.Subject, emailRequest.Content);
                    }
                    foreach (var emailReq in mrfUserList)
                    {
                        _emailService.SendEmailAsync(emailReq.Email, emailRequest.Subject, emailRequest.Content);
                    }
                }

                if (employeedetails.Id != 0)
                {
                    CallEmployeeRoleMapController(request, employeedetails.Id);
                }
                else
                {
                    _logger.LogError($"Unable to add mrf details");

                }
            }
            else {
                _logger.LogError("Already Exists");
            }
           

            return _responseModel;


        }
        private void CallEmployeeRoleMapController(EmployeedetailsRequestModel request, int id)
        {

            var freshmrRequest = new EmployeerolemapRequestModel
            {
                EmployeeId = id,
                RoleId = request.RoleId,
                CreatedByEmployeeId = request.CreatedByEmployeeId,
                CreatedOnUtc = request.CreatedOnUtc,
                UpdatedByEmployeeId = request.UpdatedByEmployeeId,
                UpdatedOnUtc = request.UpdatedOnUtc

            };
            EmployeerolemapController freshmrController = new EmployeerolemapController(_unitOfWork, _logger);
            var freshmrResponse = freshmrController.PostPost(freshmrRequest);



        }
        // PUT api/<EmployeedetailsController>/5
        [HttpPut("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item updated successfully", Type = typeof(Employeedetails))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful update)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status422UnprocessableEntity, Description = "Unprocessable entity")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public EmployeedetailsResponseModel Put(int id, [FromBody] EmployeedetailsRequestModel request)
        {

            var existingStatus = _unitOfWork.Employeedetails.Get(u => u.Id == id);
            if (existingStatus != null)
            {
                existingStatus.Name = request.Name;
                existingStatus.Email = request.Email;
                existingStatus.ContactNo = request.ContactNo;
                existingStatus.IsAllowed = request.IsAllowed;
                existingStatus.EmployeeCode = request.EmployeeCode;
                existingStatus.IsDeleted = request.IsDeleted;
                existingStatus.RoleId = request.RoleId;
                existingStatus.AllowedByEmployeeId = request.AllowedByEmployeeId;
                existingStatus.CreatedByEmployeeId = request.CreatedByEmployeeId;
                existingStatus.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                existingStatus.UpdatedOnUtc = request.UpdatedOnUtc;

                _unitOfWork.Employeedetails.Update(existingStatus);
                _unitOfWork.Save();


                _responseModel.Id = existingStatus.Id;

                //if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
                //{

                //    emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "Update user");
                //    if (emailRequest != null)
                //    {
                //        _emailService.SendEmail(emailRequest.emailTo, emailRequest.Subject, emailRequest.Content);
                //    }
                //}

               // _responseModel.Id = existingStatus.Id;



            }
            if (_responseModel.Id != 0)
            {
                CallEmployeeRoleMapControllerForUpdate(request, _responseModel.Id);
            }
            else
            {
                _logger.LogError($"No result found by this Id: {id}");
                _responseModel.Id = 0;
                _responseModel.IsActive = false;
            }


            return _responseModel;
        }

        private void CallEmployeeRoleMapControllerForUpdate(EmployeedetailsRequestModel request, int id)
        {
            var existingStatus = _unitOfWork.Employeerolemap.Get(u => u.EmployeeId == id);
            if (existingStatus != null)
            {
                existingStatus.EmployeeId = id;
                existingStatus.RoleId = request.RoleId;
                existingStatus.IsActive = request.IsAllowed;
                existingStatus.CreatedByEmployeeId = request.CreatedByEmployeeId;
                existingStatus.UpdatedByEmployeeId = request.UpdatedByEmployeeId;
                existingStatus.UpdatedOnUtc = request.UpdatedOnUtc;
                _unitOfWork.Employeerolemap.Update(existingStatus);
                _unitOfWork.Save();



            }




        }

        // DELETE api/<EmployeedetailsController>/5
        [HttpDelete("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Item deleted successfully", Type = typeof(Employeedetails))]
        [SwaggerResponse(StatusCodes.Status204NoContent, Description = "No content (successful deletion)")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal server error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public void Delete(int id)
        {

            Employeedetails? obj = _unitOfWork.Employeedetails.Get(u => u.Id == id);
            if (obj != null)
            {
                _unitOfWork.Employeedetails.Remove(obj);
                _unitOfWork.Save();

                if (_hostEnvironment.IsEnvironment("Development") || _hostEnvironment.IsEnvironment("Production"))
                {
                    emailmaster emailRequest = _unitOfWork.emailmaster.Get(u => u.status == "Delete User");

                    List<int> RoleIds = new List<int>();
                    RoleIds = emailRequest.roleId.Split(',').Select(int.Parse).ToList();
                    List<EmailRecipient> mrfUserList = _unitOfWork.EmailRecipient.GetEmployeeEmailByRoleIds(RoleIds);
                    if (emailRequest != null)
                    {
                        _emailService.SendEmailAsync(emailRequest.emailTo, emailRequest.Subject, emailRequest.Content);
                    }
                    foreach (var emailReq in mrfUserList)
                    {
                        _emailService.SendEmailAsync(emailReq.Email, emailRequest.Subject, emailRequest.Content);
                    }
                }
            }
            else
            {
                _logger.LogError($"No result found by this Id: {id}");
            }




        }

        [HttpGet("{id}")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Employeedetails>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO GetEmployee(int id)
        {

            _logger.LogInfo("Fetching All Employee details");
            List<Employeedetails> obj = _unitOfWork.Employeedetails.GetEmployee(id);

            if (obj.Count == 0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = obj;
            return _response;   


        }

        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Employeedetails>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO GetAllEmpRoleWithEmpCode()
        {
            _logger.LogInfo("Fetching Employee details");
            List<Employeedetails> obj = _unitOfWork.Employeedetails.GetAllEmpRoleWithEmpCode();

            if (obj.Count == 0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = obj;            
            return _response;
        }


        [HttpGet("empcode")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<Employeedetails>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO GetEmployeeByEmpCode(int empcode)
        {
            _logger.LogInfo("Fetching Employee details");
            List<Employeedetails> obj = _unitOfWork.Employeedetails.GetEmployeeByEmpCode(empcode);

            if (obj.Count == 0)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = obj;
            return _response;
        }
    }
}

            
       
