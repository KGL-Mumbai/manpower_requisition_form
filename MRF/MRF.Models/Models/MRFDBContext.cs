using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MRF.Models.Models;

public partial class MRFDBContext : DbContext
{
    public MRFDBContext()
    {
    }

    public MRFDBContext(DbContextOptions<MRFDBContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Candidatedetails> Candidatedetails { get; set; }

    public virtual DbSet<Candidatestatusmaster> Candidatestatusmasters { get; set; }

    public virtual DbSet<Departmentmaster> Departmentmasters { get; set; }

    public virtual DbSet<Employeedetails> Employeedetails { get; set; }

    public virtual DbSet<Employeelogindetails> Employeelogindetails { get; set; }

    public virtual DbSet<Employeerolemap> Employeerolemaps { get; set; }

    public virtual DbSet<Employmenttypemaster> Employmenttypemasters { get; set; }

    public virtual DbSet<Evaluationfeedbackmaster> Evaluationfeedbackmasters { get; set; }

    public virtual DbSet<Evaluationmaster> Evaluationmasters { get; set; }

    public virtual DbSet<Evaluationstatusmaster> Evaluationstatusmasters { get; set; }

    public virtual DbSet<Freshmrfdetails> Freshmrfdetails { get; set; }

    public virtual DbSet<Gendermaster> Gendermasters { get; set; }

    public virtual DbSet<Grademaster> Grademasters { get; set; }

    public virtual DbSet<Interviewevaluation> Interviewevaluations { get; set; }

    public virtual DbSet<Locationmaster> Locationmasters { get; set; }

    public virtual DbSet<Mrfdetails> Mrfdetails { get; set; }

    public virtual DbSet<Mrffeedback> Mrffeedbacks { get; set; }

    public virtual DbSet<Mrfinterviewermap> Mrfinterviewermaps { get; set; }

    public virtual DbSet<Mrfresumereviewermap> Mrfresumereviewermaps { get; set; }

    public virtual DbSet<Mrfstatusmaster> Mrfstatusmasters { get; set; }

    public virtual DbSet<Projectmaster> Projectmasters { get; set; }

    public virtual DbSet<Qualificationmaster> Qualificationmasters { get; set; }

    public virtual DbSet<Replacementmrfdetails> Replacementmrfdetails { get; set; }

    public virtual DbSet<Resumeforwarddetails> Resumeforwarddetails { get; set; }

    public virtual DbSet<Rolemaster> Rolemasters { get; set; }

    public virtual DbSet<Subdepartmentmaster> Subdepartmentmasters { get; set; }

    public virtual DbSet<Vacancytypemaster> Vacancytypemasters { get; set; }
    public virtual DbSet<AttachmentEvaluation> AttachmentEvaluation { get; set; }
    public virtual DbSet<MrfStatusRoleMap> MrfStatusRoleMap { get; set; }
    public virtual DbSet<MrfLastNumber> MrfLastNumber { get; set; }
    public virtual DbSet<MrfEmailApproval> MrfEmailApproval { get; set; }
    public virtual DbSet<mrfDetailsStatusHistory> mrfDetailsStatusHistory { get; set; }

    public virtual DbSet<InterviewevaluationHistory> InterviewevaluationHistory { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=mrf;user=root;password=Info@2023", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.15-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Candidatedetails>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("candidatedetails");

            entity.HasIndex(e => e.CandidateStatusId, "FK_CandidateStatusMasterCandidateDetails");

            entity.HasIndex(e => e.MrfId, "FK_MrfDetailsCandidateDetails");

            

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CandidateStatusId).HasColumnType("int(11)");
            entity.Property(e => e.ContactNo).HasMaxLength(15);
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.EmailId).HasMaxLength(100);
            entity.Property(e => e.MrfId).HasColumnType("int(11)");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.ResumePath).HasColumnType("text");
            entity.Property(e => e.Reason).HasColumnType("text");
            entity.Property(e => e.ReviewedByEmployeeIds).HasColumnType("text");
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Candidatestatusmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("candidatestatusmaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Departmentmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("departmentmaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Employeedetails>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("employeedetails");

            entity.HasIndex(e => e.AllowedByEmployeeId, "FK_UserDetailsUserDetails");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.AllowedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.ContactNo).HasMaxLength(15);
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(80);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Employeelogindetails>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("employeelogindetails");

            entity.HasIndex(e => e.EmployeeId, "FK_UserMasterUserLoginDetails");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.EmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.LoginDateTime)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Employeerolemap>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("employeerolemap");

            entity.HasIndex(e => e.RoleId, "FK_RoleMasterUserLoginDetails");

            entity.HasIndex(e => e.EmployeeId, "FK_UserMasterUserRoleMap");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.EmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.RoleId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Employmenttypemaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("employmenttypemaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Evaluationfeedbackmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("evaluationfeedbackmaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });


        modelBuilder.Entity<CandidateInterviewFeedback>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("CandidateInterviewFeedback");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.EvaluationFeedBackId).HasColumnType("int(11)");
            entity.Property(e => e.CandidateId).HasColumnType("int(11)");
            entity.Property(e => e.FeedbackAsDraft).HasColumnType("int(11)");
            entity.Property(e => e.InterviewRound).HasColumnType("int(11)");
            entity.Property(e => e.Comments).HasMaxLength(255);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Evaluationmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("evaluationmaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Type).HasMaxLength(80);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Evaluationstatusmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("evaluationstatusmaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc).HasColumnType("int(11)");
        });

        modelBuilder.Entity<Freshmrfdetails>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("freshmrfdetails");

            entity.HasIndex(e => e.MrfId, "FK_MrfDetailsFreshMrfDetails");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.JobDescription).HasColumnType("text");
            entity.Property(e => e.Justification).HasColumnType("text");
            entity.Property(e => e.MaxTargetSalary).HasColumnType("float(11)");
            entity.Property(e => e.MinTargetSalary).HasColumnType("float(11)");
            entity.Property(e => e.MrfId).HasColumnType("int(11)");
            entity.Property(e => e.Skills).HasColumnType("text");
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Gendermaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("gendermaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<mrfDetailsStatusHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mrfDetailsStatusHistory");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.MrfId).HasColumnType("int(11)");
            entity.Property(e => e.mrfStatusId).HasColumnType("int(11)");
           
        });

        modelBuilder.Entity<Grademaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("grademaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Interviewevaluation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("interviewevaluation");

            entity.HasIndex(e => e.CandidateId, "FK_CandidateMasterInterviewEvaluation");

            //entity.HasIndex(e => e.EvaluationFeedbackId, "FK_EvaluationFeedbackMasterInterviewEvaluation");

            //entity.HasIndex(e => e.EvaluationId, "FK_EvaluationMasterInterviewEvaluation");

            entity.HasIndex(e => e.EvalutionStatusId, "FK_EvaluationStatusMasterInterviewEvaluation");

            entity.HasIndex(e => e.InterviewerId, "FK_UserDetailsInterviewEvaluation");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CandidateId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            //entity.Property(e => e.EvaluationFeedbackId).HasColumnType("int(11)");
            //entity.Property(e => e.EvaluationId).HasColumnType("int(11)");
            entity.Property(e => e.EvalutionStatusId).HasColumnType("int(11)");
            //entity.Property(e => e.FeedbackAsDraft).HasMaxLength(100);
            entity.Property(e => e.FromTimeUtc).HasColumnType("time");
            entity.Property(e => e.InterviewerId).HasColumnType("int(11)");
            entity.Property(e => e.ToTimeUtc).HasColumnType("time");
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });



        modelBuilder.Entity<AttachmentEvaluation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("AttachemntEvaluation");
            
            entity.HasIndex(e => e.InterviewEvaluationId, "FK_InterviewEvaluation");
            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.InterviewEvaluationId).HasColumnType("int(11)");
            entity.Property(e => e.FilePath).HasColumnType("text");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
          
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Locationmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("locationmaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Location).HasMaxLength(50);
            entity.Property(e => e.ShortCode).HasMaxLength(6);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Mrfdetails>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mrfdetails");

            entity.HasIndex(e => e.DepartmentId, "FK_DepartmentMasterMrfDetails");

            entity.HasIndex(e => e.EmploymentTypeId, "FK_EmploymentTypeMasterMrfDetails");

            entity.HasIndex(e => e.GenderId, "FK_GenderMasterMrfDetails");

            entity.HasIndex(e => e.MinGradeId, "FK_GradeMasterMrfDetails");
            entity.HasIndex(e => e.MaxGradeId, "FK_GradeMasterMrfDetails2");

            entity.HasIndex(e => e.LocationId, "FK_LocationMasterMrfDetails");

            entity.HasIndex(e => e.MrfStatusId, "FK_MrfStatusMasterMrfDetails");

            entity.HasIndex(e => e.ProjectId, "FK_ProjectMasterMrfDetails");

            entity.HasIndex(e => e.SubDepartmentId, "FK_SubDepartmentMasterMrfDetails");

            entity.HasIndex(e => e.ReportsToEmployeeId, "FK_UserMasterMrfDetails");

            entity.HasIndex(e => e.VacancyTypeId, "FK_VacancyTypeMasterMrfDetails");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.DepartmentId).HasColumnType("int(11)");
            entity.Property(e => e.EmploymentTypeId).HasColumnType("int(11)");
            entity.Property(e => e.GenderId).HasColumnType("int(11)");
            entity.Property(e => e.MinGradeId).HasColumnType("int(11)");
            entity.Property(e => e.MaxGradeId).HasColumnType("int(11)");
            entity.Property(e => e.JdDocPath).HasColumnType("text");
            entity.Property(e => e.LocationId).HasColumnType("int(11)");
            entity.Property(e => e.MaxExperience).HasColumnType("int(11)");
            entity.Property(e => e.MinExperience).HasColumnType("int(11)");
            entity.Property(e => e.MrfStatusId).HasColumnType("int(11)");
            entity.Property(e => e.PositionTitleId).HasColumnType("int(11)");
            entity.Property(e => e.RequisitionType).HasMaxLength(80);
            entity.Property(e => e.ProjectId).HasColumnType("int(11)");
            entity.Property(e => e.ReferenceNo).HasMaxLength(80);
            entity.Property(e => e.ReportsToEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.SubDepartmentId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.VacancyNo).HasColumnType("int(11)");
            entity.Property(e => e.VacancyTypeId).HasColumnType("int(11)");
        });

        modelBuilder.Entity<Mrffeedback>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mrffeedback");

            entity.HasIndex(e => e.MrfId, "FK_MrfDetailsMrfFeedback");

            entity.HasIndex(e => e.FeedbackByEmployeeId, "FK_UserMasterMrfFeedback");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Feedback).HasColumnType("text");
            entity.Property(e => e.FeedbackByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.MrfId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Mrfinterviewermap>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mrfinterviewermap");

            entity.HasIndex(e => e.MrfId, "FK_MrfDetailsMrfInterviewerMap");

            entity.HasIndex(e => e.InterviewerEmployeeId, "FK_UserDetailsMrfInterviewerMap");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.InterviewerEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.MrfId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Mrfresumereviewermap>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mrfresumereviewermap");

            entity.HasIndex(e => e.MrfId, "FK_MrfDetailsMrfResumeReviewerMap");

            entity.HasIndex(e => e.ResumeReviewerEmployeeId, "FK_UserMasterMrfResumeReviewerMap");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.MrfId).HasColumnType("int(11)");
            entity.Property(e => e.ResumeReviewerEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Mrfstatusmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mrfstatusmaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Projectmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("projectmaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Qualificationmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("qualificationmaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Replacementmrfdetails>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("replacementmrfdetails");

            //entity.HasIndex(e => e.GradeId, "FK_GradeMasterReplacementMrfDetails");

            entity.HasIndex(e => e.MrfId, "FK_MrfDetailsReplacementMrfDetails");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.AnnualCtc)
                .HasColumnType("float(11)")
                .HasColumnName("AnnualCTC");
            entity.Property(e => e.AnnualGross).HasColumnType("float(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.EmailId).HasMaxLength(80);
            entity.Property(e => e.EmployeeCode).HasColumnType("int(11)");
            entity.Property(e => e.EmployeeName).HasMaxLength(80);
            //entity.Property(e => e.GradeId).HasColumnType("int(11)");
            entity.Property(e => e.Justification).HasColumnType("text");
            entity.Property(e => e.MrfId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Resumeforwarddetails>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("resumeforwarddetails");

            entity.HasIndex(e => e.CandidateId, "FK_CandidateDetailsResumeForwardDetails");

            entity.HasIndex(e => e.ForwardedFromEmployeeId, "FK_UserMasterResumeForwardDetails");

            entity.HasIndex(e => e.ForwardedToEmployeeId, "FK_UserMasterResumeForwardDetails2");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CandidateId).HasColumnType("int(11)");
            entity.Property(e => e.ForwardedFromEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.ForwardedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.ForwardedToEmployeeId).HasColumnType("int(11)");
        });

        modelBuilder.Entity<Rolemaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("rolemaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Subdepartmentmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("subdepartmentmaster");

            entity.HasIndex(e => e.DepartmentId, "FK_DepartmentMasterSubDepartmentMaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.DepartmentId).HasColumnType("int(11)");
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Vacancytypemaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vacancytypemaster");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });


        modelBuilder.Entity<emailmaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("emailmaster");

            entity.Property(e => e.status).HasMaxLength(50);
            entity.Property(e => e.Subject).HasMaxLength(50);
            entity.Property(e => e.Content).HasMaxLength(50);
        });

        modelBuilder.Entity<MrfLastNumber>(entity =>
        {

            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("MrfLastNumber");
            entity.Property(e => e.LastNumber).HasColumnType("int(11)");

        });
        modelBuilder.Entity<InterviewevaluationHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("interviewevaluationHistory");

            entity.HasIndex(e => e.CandidateId, "FK_CandidateMasterInterviewEvaluation");

            //entity.HasIndex(e => e.EvaluationFeedbackId, "FK_EvaluationFeedbackMasterInterviewEvaluation");

            //entity.HasIndex(e => e.EvaluationId, "FK_EvaluationMasterInterviewEvaluation");

            entity.HasIndex(e => e.EvalutionStatusId, "FK_EvaluationStatusMasterInterviewEvaluation");

            entity.HasIndex(e => e.InterviewerId, "FK_UserDetailsInterviewEvaluation");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.CandidateId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            //entity.Property(e => e.EvaluationFeedbackId).HasColumnType("int(11)");
            //entity.Property(e => e.EvaluationId).HasColumnType("int(11)");
            entity.Property(e => e.EvalutionStatusId).HasColumnType("int(11)");
            //entity.Property(e => e.FeedbackAsDraft).HasMaxLength(100);
            entity.Property(e => e.FromTimeUtc).HasColumnType("time");
            entity.Property(e => e.InterviewerId).HasColumnType("int(11)");
            entity.Property(e => e.ToTimeUtc).HasColumnType("time");
            entity.Property(e => e.UpdatedByEmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.UpdatedOnUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<MrfEmailApproval>(entity =>
        {

            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("MrfEmailApproval");
            entity.Property(e => e.EmployeeId).HasColumnType("int(11)");
            entity.Property(e => e.MrfId).HasColumnType("int(11)");
            entity.Property(e => e.ApprovalDate)
                .HasDefaultValueSql("CURRENT_DATE()")
                .HasColumnType("date");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
