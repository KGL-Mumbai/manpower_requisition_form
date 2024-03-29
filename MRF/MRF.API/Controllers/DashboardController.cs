﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using MRF.Models.ViewModels;
using MRF.Utility;
using Swashbuckle.AspNetCore.Annotations;

namespace MRF.API.Controllers
{
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")]
    [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]

    public class DashboardController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private ResponseDTO _response;
        private readonly ILoggerService _logger;

        public DashboardController(IUnitOfWork unitOfWork, ILoggerService logger)
        {
            _unitOfWork = unitOfWork;
            _response = new ResponseDTO();
            _logger = logger;
        }

        // GET: api/<MrfstatusController>
        [HttpGet]

        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(IEnumerable<MrfSummaryViewModel>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO GetMrfStatusSummary(int roleId,int userId)
        {
            _logger.LogInfo("Fetching All Mrf resume reviewer map");
            List<MrfSummaryViewModel> MrfStatusSummary = _unitOfWork.Dashboard.GroupByMrfStatus(roleId, userId).ToList();
            if (roleId == 3)
            {
                var r = from data in MrfStatusSummary
                        where
                 (data.MrfStatusId != 4 && data.MrfStatusId != 5 && data.MrfStatusId != 11 && data.MrfStatusId != 12 &&
                 data.MrfStatusId != 13 && data.MrfStatusId != 14 && data.MrfStatusId != 15)
                        select data;
                _response.Result = r;
            }
            else {
                _response.Result = MrfStatusSummary;
            }
            
            if (MrfStatusSummary == null)
            {
                _logger.LogError("No record is found");
            }
            

            _logger.LogInfo($"Total Mrf resume reviewer map count: {MrfStatusSummary.Count}");
            return _response;
        }

        [HttpGet("Count")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(MrfResumeSummaryViewModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO GetMrfResumeSummary(int Count, int roleId, int userId)
        {
            _logger.LogInfo("Fetching All Mrf resume reviewer map");
            //List<MrfResumeSummaryViewModel> mrfresumereviewermapList = _unitOfWork.Dashboard.GetCountByMrfIdAndResumeStatus().ToList();
            List<ResultViewModel> mrfresumereviewermapList = _unitOfWork.Dashboard.GetCountByMrfIdAndResumeStatus(Count,roleId,userId).ToList();

            if (mrfresumereviewermapList == null)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = mrfresumereviewermapList;
            _logger.LogInfo($"Total Mrf resume reviewer map count: {mrfresumereviewermapList.Count()}");
            return _response;
        }


        [HttpGet("Count")]
        [SwaggerResponse(StatusCodes.Status200OK, Description = "Successful response", Type = typeof(MrfInterviewSummaryViewModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, Description = "Bad Request")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, Description = "Unauthorized")]
        [SwaggerResponse(StatusCodes.Status403Forbidden, Description = "Forbidden")]
        [SwaggerResponse(StatusCodes.Status404NotFound, Description = "Not Found")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, Description = "Internal Server Error")]
        [SwaggerResponse(StatusCodes.Status503ServiceUnavailable, Description = "Service Unavailable")]
        public ResponseDTO GetMrfInterviewSummary(int Count, int roleId, int userId)
        {
            _logger.LogInfo("Fetching All Mrf resume reviewer map");
            List<ResultViewModel> mrfInterviewSummary = _unitOfWork.Dashboard.GroupByMrfInterviewStatus(Count, roleId, userId).ToList();
            if (mrfInterviewSummary == null)
            {
                _logger.LogError("No record is found");
            }
            _response.Result = mrfInterviewSummary;
            _logger.LogInfo($"Total Mrf resume reviewer map count: {mrfInterviewSummary.Count}");
            return _response;
        }

    }
}
