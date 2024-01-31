using MRF.DataAccess.Repository.IRepository;
using MRF.Models.Models;

namespace MRF.DataAccess.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly Data.MRFDBContext _db;
        private readonly IUserService _userService;
        public ICandidatestatusmasterRepository Candidatestatusmaster { get; private set; }
        public IDepartmentmasterRepository Departmentmaster { get; private set; }
        public IEmploymenttypemasterRepository Employmenttypemaster { get; private set; }
        public IEvaluationfeedbackmasterRepository Evaluationfeedbackmaster { get; private set; }
        public IEvaluationmasterRepository Evaluationmaster { get; private set; }
        public IEvaluationstatusmasterRepository Evaluationstatusmaster { get; private set; }
        public IGendermasterRepository Gendermaster { get; private set; }
        public IGrademasterRepository Grademaster { get; private set; }
        public ILocationmasterRepository Locationmaster { get; private set; }
        public IMrfstatusmasterRepository Mrfstatusmaster { get; private set; }
        public IProjectmasterRepository Projectmaster { get; private set; }
        public IQualificationmasterRepository Qualificationmaster { get; private set; }
        public IRolemasterRepository Rolemaster { get; private set; }
        public ISubdepartmentmasterRepository Subdepartmentmaster { get; private set; }
        public IVacancytypemasterRepository Vacancytypemaster { get; private set; }
        public IMrfdetailRepository Mrfdetail { get; private set; }
        public IMrffeedbackRepository Mrffeedback { get; private set; }
        public IMrfinterviewermapRepository Mrfinterviewermap { get; private set; }
        public IMrfresumereviewermapRepository Mrfresumereviewermap { get; private set; }
        public IReplacementmrfdetailRepository Replacementmrfdetail { get; private set; }
        public IResumeforwarddetailRepository Resumeforwarddetail { get; private set; }
        public IEmployeedetailsRepository Employeedetails { get; private set; }
        public IEmployeelogindetailRepository Employeelogindetail { get; private set; }
        public IEmployeerolemapRepository Employeerolemap { get; private set; }
        public IFreshmrfdetailRepository Freshmrfdetail { get; private set; }
        public ICandidatedetailRepository Candidatedetail { get; private set; }
        public IInterviewevaluationRepository Interviewevaluation { get; private set; }
        public IDashboardRepository Dashboard { get; private set; }
        public IMrfStatusDetailsRepository MrfStatusDetail { get; private set; }
        public IResumeDetailsRepository ResumeDetail { get; private set; }
        public IInterviewDetailsRepository InterviewDetail { get; private set; }
        public IAttachmentEvaluationRepository AttachmentEvaluation { get; private set; }
        public IEmailRepository emailmaster { get; private set; }
        public IMrfStatusRoleMapRepository MrfStatusRoleMap { get; private set; }
        public IMrfLastNumberRepository MrfLastNo { get; private set; }
        public IMrfEmailApprovalRepository MrfEmailApproval { get; private set; }
        public ICandidateInterviewFeedbackRepository CandidateInterviewFeedback { get; private set; }
        public ImrfDetailsStatusHistory mrfDetailsStatusHistory { get; private set; }
        public IMrfdetailsPDFRepository MrfdetailsEmailRepository { get; private set; }
        public IPositionTitlemasterRepository PositionTitlemaster { get; private set; }
        public  ISourcemasterRepository  Sourcemaster { get; private set; }
        public IEmailRecipientRepository EmailRecipient { get; private set; }

        public  IInterviewevaluationHistoryRepository InterviewevaluationHistory { get; private set; }
        public UnitOfWork(Data.MRFDBContext db, IUserService userService)
        {
            _db = db;
            _userService = userService;
            Candidatestatusmaster = new CandidatestatusmasterRepository(_db);
            Departmentmaster = new DepartmentmasterRepository(_db);
            Employmenttypemaster = new EmploymenttypemasterRepository(_db);
            Evaluationfeedbackmaster = new EvaluationfeedbackmasterRepository(_db);
            Evaluationmaster = new EvaluationmasterRepository(_db);
            Evaluationstatusmaster = new EvaluationstatusmasterRepository(_db);
            Gendermaster = new GendermasterRepository(_db);
            Grademaster = new GrademasterRepository(_db);
            Locationmaster = new LocationmasterRepository(_db);
            Mrfstatusmaster = new MrfstatusmasterRepository(_db);
            Projectmaster = new ProjectmasterRepository(_db);
            Qualificationmaster = new QualificationmasterRepository(_db);
            Rolemaster = new RolemasterRepository(_db);
            Subdepartmentmaster = new SubdepartmentmasterRepository(_db);
            Vacancytypemaster = new VacancytypemasterRepository(_db);
            Mrfdetail = new MrfdetailRepository(_db);
            Mrffeedback = new MrffeedbackRepository(_db);
            Mrfinterviewermap = new MrfinterviewermapRepository(_db);
            Mrfresumereviewermap = new MrfresumereviewermapRepository(_db);
            Replacementmrfdetail = new ReplacementmrfdetailRepository(_db);
            Resumeforwarddetail = new ResumeforwarddetailRepository(_db);
            Employeedetails = new EmployeedetailsRepository(_db);
            Employeelogindetail = new EmployeelogindetailRepository(_db);
            Employeerolemap = new EmployeerolemapRepository(_db);
            Freshmrfdetail = new FreshmrfdetailRepository(_db);
            Candidatedetail = new CandidatedetailRepository(_db);
            Interviewevaluation = new InterviewevaluationRepository(_db);
            Dashboard = new DashboardRepository(_db, _userService);
            MrfStatusDetail = new MrfStatusDetailsRepository(_db);
            ResumeDetail = new ResumeDetailsRepository(_db);
            InterviewDetail = new InterviewDetailsRepository(_db);
            AttachmentEvaluation = new AttachmentEvaluationRepository(_db);
            emailmaster = new EmailRepository(_db);
            MrfStatusRoleMap = new MrfStatusRoleMapRepository(_db);
            MrfLastNo = new MrfLastNumberRepository(_db);
            MrfEmailApproval = new MrfEmailApprovalRepository(_db);
            CandidateInterviewFeedback = new CandidateInterviewFeedbackRepository(_db);
            mrfDetailsStatusHistory=new mrfDetailsStatusHistoryRepository(_db);
            MrfdetailsEmailRepository = new MrfdetailsEmailRepository(_db);
            PositionTitlemaster = new PositionTitleRepository(_db);
            Sourcemaster = new  SourceRepository(_db);
            EmailRecipient= new EmailRecipientRepository(_db);
            InterviewevaluationHistory=new InterviewevaluationHistoryRepository(_db);
        }
        public void Save()
        {
            _db.SaveChanges();
        }
    }
}
