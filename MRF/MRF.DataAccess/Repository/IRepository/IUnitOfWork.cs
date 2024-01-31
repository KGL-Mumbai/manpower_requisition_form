namespace MRF.DataAccess.Repository.IRepository
{
    public interface IUnitOfWork
    {
        ICandidatestatusmasterRepository Candidatestatusmaster { get; }
        IDepartmentmasterRepository Departmentmaster { get; }
        IEmploymenttypemasterRepository Employmenttypemaster { get; }
        IEvaluationfeedbackmasterRepository Evaluationfeedbackmaster { get; }
        IEvaluationmasterRepository Evaluationmaster { get; }
        IEvaluationstatusmasterRepository Evaluationstatusmaster { get; }
        IGendermasterRepository Gendermaster { get; }
        IGrademasterRepository Grademaster { get; }
        ILocationmasterRepository Locationmaster { get; }
        IMrfstatusmasterRepository Mrfstatusmaster { get; }
        IProjectmasterRepository Projectmaster { get; }
        IQualificationmasterRepository Qualificationmaster { get; }
        IRolemasterRepository Rolemaster { get; }
        ISubdepartmentmasterRepository Subdepartmentmaster { get; }
        IVacancytypemasterRepository Vacancytypemaster { get; }
        IMrfdetailRepository Mrfdetail { get; }
        IMrffeedbackRepository Mrffeedback { get; }
        IMrfinterviewermapRepository Mrfinterviewermap { get; }
        IMrfresumereviewermapRepository Mrfresumereviewermap { get; }
        IReplacementmrfdetailRepository Replacementmrfdetail { get; }
        IResumeforwarddetailRepository Resumeforwarddetail { get; }
        IEmployeedetailsRepository Employeedetails { get; }
        ICandidatedetailRepository Candidatedetail { get; }
        IInterviewevaluationRepository Interviewevaluation { get; }
        IEmployeelogindetailRepository Employeelogindetail { get; }
        IEmployeerolemapRepository Employeerolemap { get; }
        IFreshmrfdetailRepository Freshmrfdetail { get; }
        IDashboardRepository Dashboard { get; }
        IMrfStatusDetailsRepository MrfStatusDetail { get; }
        IResumeDetailsRepository ResumeDetail { get; }
        IInterviewDetailsRepository InterviewDetail { get; }
        IAttachmentEvaluationRepository AttachmentEvaluation { get; }
        IEmailRepository emailmaster { get; }
        IMrfStatusRoleMapRepository MrfStatusRoleMap { get; }
        IMrfLastNumberRepository MrfLastNo { get; }
        IMrfEmailApprovalRepository MrfEmailApproval { get; }
        ICandidateInterviewFeedbackRepository CandidateInterviewFeedback { get; }
        ImrfDetailsStatusHistory mrfDetailsStatusHistory { get; }
        IMrfdetailsPDFRepository MrfdetailsEmailRepository { get; }
        IPositionTitlemasterRepository PositionTitlemaster { get; }
         ISourcemasterRepository  Sourcemaster { get; }
        IEmailRecipientRepository EmailRecipient { get; }
        IInterviewevaluationHistoryRepository InterviewevaluationHistory { get; }
        void Save();
    }
}
