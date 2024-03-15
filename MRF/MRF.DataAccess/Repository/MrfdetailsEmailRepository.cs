using Microsoft.EntityFrameworkCore;
using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;

namespace MRF.DataAccess.Repository
{
    public class MrfdetailsEmailRepository : Repository<MrfdetailsPDF>, IMrfdetailsPDFRepository
    {
        private readonly Data.MRFDBContext _db;
        public MrfdetailsEmailRepository(Data.MRFDBContext db) : base(db)
        {
            _db = db;
        }
        public MrfdetailsEmailRequestModel GetRequisition(int MrfId)
        {
            string subName = string.Empty;
            var subId = (from mr in _db.Mrfdetails where mr.Id == MrfId select mr.SubDepartmentId).FirstOrDefault();
            if (subId > 0)
            {
                subName = (from sd in _db.Subdepartmentmaster where sd.Id == subId select sd.Name).FirstOrDefault();
            }
            
            //before List<MrfdetailsEmailRequestModel> query
            IQueryable <MrfdetailsEmailRequestModel> query = (from MD in _db.Mrfdetails
                                                                join DEPT in _db.Departmentmaster on MD.DepartmentId equals DEPT.Id
                                                                //join SUBDEPT in _db.Departmentmaster on MD.SubDepartmentId equals SUBDEPT.Id
                                                                join PM in _db.Projectmaster on MD.ProjectId equals PM.Id
                                                                join VM in _db.Vacancytypemaster on MD.VacancyTypeId equals VM.Id
                                                                join GN in _db.Gendermaster on MD.GenderId equals GN.Id
                                                                join ED in _db.Employeedetails on MD.ReportsToEmployeeId equals ED.Id
                                                                join MINGM in _db.Grademaster on MD.MinGradeId equals MINGM.Id
                                                                join MAXGM in _db.Grademaster on MD.MaxGradeId equals MAXGM.Id
                                                                join EMPTYP in _db.Employmenttypemaster on MD.EmploymentTypeId equals EMPTYP.Id
                                                                join MRFS in _db.Mrfstatusmaster on MD.MrfStatusId equals MRFS.Id
                                                                join LOC in _db.Locationmaster on MD.LocationId equals LOC.Id
                                                                join QUA in _db.Qualificationmaster on MD.QualificationId equals QUA.Id
                                                                //join CBED in _db.Employeedetails on MD.CreatedByEmployeeId equals CBED.Id
                                                                //join UBED in _db.Employeedetails on MD.UpdatedByEmployeeId equals UBED.Id
                                                                join FMRF in _db.Freshmrfdetails on MD.Id equals FMRF.MrfId
                                                                join CBY in _db.Employeedetails on MD.CreatedByEmployeeId equals CBY.Id
                                                                join PNAME in _db.PositionTitlemaster on MD.PositionTitleId equals PNAME.Id
                                                                where MD.Id == MrfId
                                                                select new MrfdetailsEmailRequestModel
                                                                {
                                                                    Id = MD.Id,
                                                                    ReferenceNo = MD.ReferenceNo,
                                                                    RequisitionType = MD.RequisitionType,
                                                                    PositionTitleId = MD.PositionTitleId,
                                                                    PositionName = PNAME.Name,
                                                                    Department = DEPT.Name,
                                                                    SubDepartment = subName,
                                                                    Project = PM.Name,
                                                                    Location = LOC.Location,
                                                                    PositionReportingto = ED.Name,
                                                                    HiringInitiationDate = MD.RequisitionDateUtc,
                                                                    GradeMin = MINGM.Name,
                                                                    GradeMax = MAXGM.Name,
                                                                    TypeOfEmployment = EMPTYP.Type,
                                                                    ReplacementForThEmployee = MD.IsReplacement,
                                                                    NumberOfVacancies = MD.VacancyNo,
                                                                    ExperienceMin = MD.MinExperience,
                                                                    ExperienceMax = MD.MaxExperience,
                                                                    TypeOfVacancy = VM.Type,
                                                                    Gender = GN.Type,
                                                                    Qualification = QUA.Type,
                                                                    JobDescription = FMRF.JobDescription,
                                                                    Skills = FMRF.Skills,
                                                                    MinTargetSalary = FMRF.MinTargetSalary,
                                                                    MaxTargetSalary = FMRF.MaxTargetSalary,
                                                                    MRFRaisedBy = CBY.Name
                                                                });
            return query.FirstOrDefault();
            //return await query.FirstOrDefaultAsync();

        }
    }
}
