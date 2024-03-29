﻿namespace MRF.Models.Models;

public class Replacementmrfdetails
{
    public int Id { get; set; }

    public int MrfId { get; set; }

    public string EmployeeName { get; set; } = null!;

    public string EmailId { get; set; } = null!;

    public int EmployeeCode { get; set; }

    public DateOnly LastWorkingDate { get; set; }

    public string Justification { get; set; } = null!;

    public float AnnualCtc { get; set; }

    public float AnnualGross { get; set; }

    //public int GradeId { get; set; }

    public int CreatedByEmployeeId { get; set; }

    public DateTime CreatedOnUtc { get; set; }

    public int UpdatedByEmployeeId { get; set; }

    public DateTime UpdatedOnUtc { get; set; }
}
