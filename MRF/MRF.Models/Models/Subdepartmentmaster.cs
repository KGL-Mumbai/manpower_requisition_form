﻿namespace MRF.Models.Models;

public class Subdepartmentmaster
{
    public int Id { get; set; }

    public int DepartmentId { get; set; }

    public string Name { get; set; } = null!;

    public bool IsActive { get; set; }

    public int CreatedByEmployeeId { get; set; }

    public DateTime CreatedOnUtc { get; set; }

    public int UpdatedByEmployeeId { get; set; }

    public DateTime UpdatedOnUtc { get; set; }
}
