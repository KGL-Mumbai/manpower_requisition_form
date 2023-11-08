﻿using System.Net;

namespace MRF.Models.DTO
{
    public class MrfdetailRequestModel
    {
        public string? ReferenceNo { get; set; } 
        public string PositionTitle { get; set; } = null!;
        public int DepartmentId { get; set; }
        public int SubDepartmentId { get; set; }
        public int ProjectId { get; set; }
        public int VacancyNo { get; set; }
        public int GenderId { get; set; }
        public DateOnly RequisitionDateUtc { get; set; }
        public int ReportsToEmployeeId { get; set; }
        public int GradeId { get; set; }
        public int EmploymentTypeId { get; set; }
        public int MinExperience { get; set; }
        public int MaxExperience { get; set; }
        public int VacancyTypeId { get; set; }
        public bool IsReplacement { get; set; }
        public int MrfStatusId { get; set; }
        public string JdDocPath { get; set; } = null!;
        public int LocationId { get; set; }
        public int CreatedByEmployeeId { get; set; }
        public DateTime CreatedOnUtc { get; set; }
        public int UpdatedByEmployeeId { get; set; }
        public DateTime UpdatedOnUtc { get; set; }


        public string Justification { get; set; } = null!;

        public string SoftwaresRequired { get; set; } = null!;

        public string HardwaresRequired { get; set; } = null!;

        public int MinTargetSalary { get; set; }

        public int MaxTargetSalary { get; set; }

        public string EmployeeName { get; set; } = null!;
        public string EmailId { get; set; } = null!;
        public int EmployeeCode { get; set; }
        public DateOnly LastWorkingDate { get; set; }
        public string ReplaceJustification { get; set; } = null!;
        public int AnnualCtc { get; set; }
        public int AnnualGross { get; set; }
       
    }
    public class MrfdetaiResponseModel
    {
        public int Id { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public String message { get; set; }
    }

}
