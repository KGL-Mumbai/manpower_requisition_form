﻿using MRF.Models.Models;

namespace MRF.DataAccess.Repository.IRepository
{
    public interface IEmployeedetailsRepository : IRepository<Employeedetails>
    {
        public void Update(Employeedetails employeedetail);
        public List<Employeedetails> GetEmployee(int id);
        public List<Employeedetails> GetAllEmpRoleWithEmpCode();
        public List<Employeedetails> GetEmployeeByEmpCode(int empcode);
    }
}




