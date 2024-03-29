﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using MRF.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.NetworkInformation;
using System.Reflection.PortableExecutable;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MRF.DataAccess.Repository
{
    public class DashboardRepository : Repository<MrDashboardViewModel>, IDashboardRepository
    {
        private readonly Data.MRFDBContext _db;
        private readonly IUserService _userService;
        private readonly Data.Utility _Utility;
        public DashboardRepository(Data.MRFDBContext db, IUserService userService) : base(db)
        {
            _db = db;
            _userService = userService;
            _Utility = new Data.Utility();
        }

        public List<MrfSummaryViewModel> GroupByMrfStatus(int roleId, int userId)
        {
            //int RoleId= _userService.GetRoleId();
            //if(RoleId == 0)
            //{
            //    ResponseDTO _response = _userService.GetRoledetails(false);

            //}
            //RoleId= _userService.GetRoleId();
            string Role = _Utility.GetRole(roleId);

            List<int> mrfIdsHiringManager = (from mrfDetails in _db.Mrfdetails
                                             join mail in _db.MrfEmailApproval on mrfDetails.Id equals mail.MrfId
                                             where mail.EmployeeId == userId && mail.RoleId == 3 //for mrf owner
                                             select mrfDetails.Id).ToList();

            var mrf = from Mrfdetails in _db.Mrfdetails


                      where (Role != "mrfowner" || (Role == "mrfowner" && mrfIdsHiringManager.Contains(Mrfdetails.Id))) //Mrfdetails.CreatedByEmployeeId == userId
                      && (Mrfdetails.HrId == null || (Role != "hr" || (Role == "hr" && Mrfdetails.HrId == userId)))

                      select Mrfdetails;


            var query = from mrfStatus in _db.Mrfstatusmaster
                        join mrfstatusRole in _db.mrfStatusrolemap on mrfStatus.Id equals mrfstatusRole.statusId
                        join mrfDetails in mrf
                        on mrfStatus.Id equals mrfDetails.MrfStatusId

                        into mrfDetailsGroup
                        where mrfstatusRole.RoleId == roleId

                        select new
                        {
                            MrfStatusId = mrfStatus.Id,
                            Status = mrfStatus.Status,
                            MrfDetailsCount = mrfDetailsGroup.Count(),

                        };


            var result = query.AsEnumerable()
                .Select(grouped => new MrfSummaryViewModel
                {
                    MrfStatusId = grouped.MrfStatusId,
                    Status = grouped.Status,
                    TotalCount = grouped.MrfDetailsCount,
                })
                .Distinct() // Apply distinct to avoid duplications
                .OrderBy(item => item.Status.Length)

                .ToList();

            return result;

        }


        public List<MrfResumeSummaryViewModel> GetCountByMrfIdAndResumeStatus1()
        {

            IQueryable<MrfResumeSummaryViewModel> query = from mrfDetails in _db.Mrfdetails
                                                          join Candidate in _db.Candidatedetails on mrfDetails.Id equals Candidate.MrfId
                                                          join status in _db.Candidatestatusmaster on Candidate.CandidateStatusId equals status.Id
                                                          where status.Status.Contains("resume")

                                                          group new { mrfDetails, Candidate, status } by new
                                                          {
                                                              mrfDetails.Id,
                                                              //Candidate.CandidateStatusId,

                                                              status.Status,
                                                              mrfDetails.ReferenceNo,

                                                          }
                    into grouped
                                                          select new MrfResumeSummaryViewModel
                                                          {
                                                              MrfId = grouped.Key.Id,
                                                              ReferenceNo = grouped.Key.ReferenceNo,
                                                              //CandidateStatusId = grouped.Key.CandidateStatusId,
                                                              Candidatestatus = grouped.Key.Status.Replace("Resume", "").Replace("Uploaded", "New").Replace("Selected", "Shortlisted").Trim(),
                                                              TotalCount = grouped.Count(),
                                                          };
            return query.ToList();


        }
        public List<ResultViewModel> GetCountByMrfIdAndResumeStatus(int count, int roleId, int userId)
        {
            List<ResultViewModel> finalresult = new List<ResultViewModel>();
            finalresult = GetCountfromCandidateStatus(count, true, roleId, userId);
            return finalresult;
        }

        public List<ResultViewModel> GetCountfromCandidateStatus(int count, bool resume, int roleId, int userId)
        {
            List<Candidatestatusmaster> CStatus = new List<Candidatestatusmaster>();
            //if (resume)
            //{
            CStatus = (from s in _db.Candidatestatusmaster
                       select new Candidatestatusmaster
                       {
                           Id = s.Id,
                           Status = s.Status,
                       }).ToList();
            //}
            IQueryable<MrfResumeSummaryViewModel> mrfDetails = null;
            string Role = _Utility.GetRole(roleId);

            if (Role == "interviewer")
            {
                //need to change these to only have active mrfids

                //get mrfIds having user as an inter to one of the candidates
                IQueryable<int> ids = from cd in _db.Candidatedetails join ie in _db.Interviewevaluation on cd.Id equals ie.CandidateId where ie.InterviewerId == userId select cd.MrfId;
                //from m in _db.Mrfdetails join mrfInter in _db.Mrfinterviewermap on m.Id equals mrfInter.MrfId where mrfInter.InterviewerEmployeeId == userId select m.Id;

                mrfDetails = (from mrfD in _db.Mrfdetails
                              join position in _db.PositionTitlemaster on mrfD.PositionTitleId equals position.Id
                              join Candidate in _db.Candidatedetails on mrfD.Id equals Candidate.MrfId
                              //join evaluation in _db.Interviewevaluation on Candidate.Id equals evaluation.CandidateId
                              //where evaluation.InterviewerId == userId
                              where ids.Contains(mrfD.Id)
                             //orderby mrfD.UpdatedOnUtc descending
                             group new { mrfD, Candidate } by new
                              {
                                  mrfD.Id,
                                  Candidate.CandidateStatusId,
                                  mrfD.ReferenceNo,
                                  position.Name,
                                  mrfD.UpdatedOnUtc,
                             }
                         into grouped
                              select new MrfResumeSummaryViewModel
                              {
                                  MrfId = grouped.Key.Id,
                                  ReferenceNo = grouped.Key.ReferenceNo,
                                  statusID = grouped.Key.CandidateStatusId,
                                  TotalCount = grouped.Count(),
                                  PositionTitle = grouped.Key.Name,
                                  UpdatedOnUtc = grouped.Key.UpdatedOnUtc,
                              }).OrderByDescending(s => s.UpdatedOnUtc);
            }
            else
            {
                List<int> mrfIdsHiringManager = (from m in _db.Mrfdetails
                                                 join mail in _db.MrfEmailApproval on m.Id equals mail.MrfId
                                                 where mail.EmployeeId == userId && mail.RoleId == 3 //for mrf owner
                                                 select m.Id).ToList();

                mrfDetails = (from mrfD in _db.Mrfdetails
                              join Candidate in _db.Candidatedetails on mrfD.Id equals Candidate.MrfId
                              join position in _db.PositionTitlemaster on mrfD.PositionTitleId equals position.Id
                              where ((Role == "mrfowner" && mrfIdsHiringManager.Contains(mrfD.Id)) //mrfD.CreatedByEmployeeId == userId
                              || (mrfD.HrId == null || (Role == "hr" && mrfD.HrId == userId))
                              || (Role == "resumereviewer" && Candidate.ReviewedByEmployeeIds != null
                              && Candidate.ReviewedByEmployeeIds.Contains(Convert.ToString(userId))) || (Role != "mrfowner" && Role != "resumereviewer" && Role != "hr"))
                               orderby mrfD.UpdatedOnUtc descending
                              group new { mrfD, Candidate } by new
                              {
                                  mrfD.Id,
                                  Candidate.CandidateStatusId,
                                  mrfD.ReferenceNo,
                                  position.Name,
                                  mrfD.UpdatedOnUtc
                              }
                        into grouped

                              select new MrfResumeSummaryViewModel
                              {
                                  MrfId = grouped.Key.Id,
                                  ReferenceNo = grouped.Key.ReferenceNo,
                                  statusID = grouped.Key.CandidateStatusId,
                                  TotalCount = grouped.Count(),
                                  PositionTitle = grouped.Key.Name,
                                  UpdatedOnUtc = grouped.Key.UpdatedOnUtc,
                              }).OrderByDescending(s => s.UpdatedOnUtc);
            }
            var result = new List<ResultViewModel>();

            bool valid = false;
            foreach (var mrf in mrfDetails)
            {
                valid = false;
                var resultViewModel = result.FirstOrDefault(r => r.mrfId == mrf.MrfId);
                if (resultViewModel == null)
                {
                    resultViewModel = new ResultViewModel
                    {
                        mrfId = mrf.MrfId,
                        referenceno = mrf.ReferenceNo,
                        positionTitle = mrf.PositionTitle,
                        resultGroups = new List<ResultGroup>()
                    };
                    valid = true;
                }

                foreach (var st in CStatus)
                {
                    var existingResultGroup = resultViewModel.resultGroups.FirstOrDefault(rg => rg.Candidatestatus == st.Status);
                    if (existingResultGroup != null)
                    {
                        if (st.Id == mrf.statusID)
                        {
                            existingResultGroup.TotalstatusCount = mrf.TotalCount;
                        }
                    }
                    else
                    {
                        var totalStatusCount = st.Id == mrf.statusID ? mrf.TotalCount : 0;
                        resultViewModel.resultGroups.Add(new ResultGroup
                        {
                            Candidatestatus = st.Status,
                            TotalstatusCount = totalStatusCount
                        });
                    }
                }

                if (valid)
                {
                    result.Add(resultViewModel);

                }
                if (count > 0 && result.Count == count)
                {
                    break;
                }
            }

            return result;

        }

        public List<ResultViewModel> GroupByMrfInterviewStatus(int count, int roleId, int userId)
        {
            List<ResultViewModel> result = new List<ResultViewModel>();
            //result = GetCountfromCandidateStatus(count, false);

            var CStatus = (from s in _db.Evaluationstatusmaster
                           select s).ToList();
            string Role = _Utility.GetRole(roleId);

            List<int> mrfIdsHiringManager = (from mrfDetails in _db.Mrfdetails
                                             join mail in _db.MrfEmailApproval on mrfDetails.Id equals mail.MrfId
                                             where mail.EmployeeId == userId && mail.RoleId == 3 //for mrf owner
                                             select mrfDetails.Id).ToList();


            /* group by mrfid and evaluation id will get count */
            var Interviewevaluation = (from mrfD in _db.Mrfdetails
                                       join Candidate in _db.Candidatedetails on mrfD.Id equals Candidate.MrfId
                                       join interview in _db.Interviewevaluation on Candidate.Id equals interview.CandidateId into interviewGroup
                                       from interview in interviewGroup.DefaultIfEmpty() // *Perform left join Interviewevaluation
                                       join status in _db.Evaluationstatusmaster on interview.EvalutionStatusId equals status.Id into statusGroup
                                       from status in statusGroup.DefaultIfEmpty() // *Perform left join Evaluationstatus
                                       join position in _db.PositionTitlemaster on mrfD.PositionTitleId equals position.Id
                                       where ((Role == "mrfowner" && mrfIdsHiringManager.Contains(mrfD.Id)) || // mrfD.CreatedByEmployeeId == userId
                                       (Role == "hr" && (mrfD.HrId == userId || mrfD.HrId == 0) ||
                                       (Role == "interviewer" && interview != null && interview.InterviewerId != 0
                                                    && interview.InterviewerId == userId
                                       //&& Candidate.CandidateStatusId == 2
                                       )
                                       || (Role != "mrfowner" && Role != "interviewer" && Role != "hr")))
                                       && Candidate.CandidateStatusId == 2
                                        
                                       select new MrfInterviewSummaryViewModel
                                       {
                                           MrfId = mrfD.Id,
                                           EvaluationId = status != null ? status.Id : 0,
                                           ReferenceNo = mrfD.ReferenceNo,
                                           PositionTitle = position.Name,
                                           UpdatedOnUtc = mrfD.UpdatedOnUtc,
                                           CandidateId = Candidate.Id,
                                       })
                        .Distinct()
                       .OrderByDescending(u => u.UpdatedOnUtc) 
                       .ToList();


            var InterviewevaluationCount = (from mrfD in Interviewevaluation
                                            group new { mrfD } by new
                                            {
                                                mrfD.MrfId,
                                                mrfD.ReferenceNo,
                                                mrfD.PositionTitle,
                                                mrfD.EvaluationId,
                                                mrfD.UpdatedOnUtc,
                                            }
                       into grouped
                                            select new MrfInterviewSummaryViewModel
                                            {
                                                MrfId = grouped.Key.MrfId,
                                                EvaluationId = grouped.Key.EvaluationId,
                                                ReferenceNo = grouped.Key.ReferenceNo,
                                                TotalCount = grouped.Count(),
                                                PositionTitle = grouped.Key.PositionTitle,
                                                UpdatedOnUtc = grouped.Key.UpdatedOnUtc
                                            })

                       .ToList();






            /*if (Role == "mrfowner" || Role == "hr")
            {
                var mrflist = (from mrfD in _db.Mrfdetails
                               join Candidate in _db.Candidatedetails on mrfD.Id equals Candidate.MrfId
                               join position in _db.PositionTitlemaster on mrfD.PositionTitleId equals position.Id
                               where ((Role == "mrfowner" && mrfD.CreatedByEmployeeId == userId) || Role != "mrfowner")
                               && Candidate.CandidateStatusId==2
                               //orderby mrfD.UpdatedOnUtc descending
                               select new MrfInterviewSummaryViewModel
                               {
                                   MrfId = mrfD.Id,
                                   ReferenceNo = mrfD.ReferenceNo,
                                   PositionTitle = position.Name,
                                   UpdatedOnUtc= mrfD.UpdatedOnUtc,
                               }).ToList();


                var newItems = mrflist
                        .OrderByDescending(x => x.UpdatedOnUtc) // Order mrflist by UpdatedOnUtc in descending order
                        .Where(x => !Interviewevaluation.Any(y => x.MrfId == y.MrfId));
                foreach (var item in newItems)
                {
                    Interviewevaluation.Add(item);
                }
            }*/



            bool valid = false;
            foreach (var mrf in InterviewevaluationCount)
            {
                valid = false;
                var resultViewModel = result.FirstOrDefault(r => r.mrfId == mrf.MrfId);
                if (resultViewModel == null)
                {
                    resultViewModel = new ResultViewModel
                    {
                        mrfId = mrf.MrfId,
                        referenceno = mrf.ReferenceNo,
                        positionTitle = mrf.PositionTitle,
                        resultGroups = new List<ResultGroup>()
                    };
                    valid = true;
                }

                foreach (var st in CStatus)
                {
                    var existingResultGroup = resultViewModel.resultGroups.FirstOrDefault(rg => rg.Candidatestatus == st.Status);
                    if (existingResultGroup != null)
                    {
                        if (st.Id == mrf.EvaluationId)
                        {
                            existingResultGroup.TotalstatusCount = mrf.TotalCount;
                        }
                    }
                    else
                    {
                        var totalStatusCount = st.Id == mrf.EvaluationId ? mrf.TotalCount : 0;
                        resultViewModel.resultGroups.Add(new ResultGroup
                        {
                            Candidatestatus = st.Status,
                            TotalstatusCount = totalStatusCount
                        });
                    }
                }

                if (valid)
                {
                    result.Add(resultViewModel);

                }
                if (count > 0 && result.Count == count)
                {
                    break;
                }
            }


            //foreach (var mrf in Interviewevaluation)
            //{
            //    /*take record of same mrfdetails match with Interviewevaluation*/
            //    var resultViewModel = result.FirstOrDefault(r => r.mrfId == mrf.MrfId);

            //    if (resultViewModel != null)
            //    {    var existingResultGroup = resultViewModel.resultGroups
            //        .First(rg => rg.Candidatestatus == mrf.Candidatestatus);
            //        if (existingResultGroup != null)
            //        {
            //            existingResultGroup.TotalstatusCount = mrf.TotalCount;
            //        }
            //    }

            //}

            return result;

        }
    }
}
