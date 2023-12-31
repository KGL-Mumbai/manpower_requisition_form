﻿using MRF.DataAccess.Repository.IRepository;
using MRF.Models.Models;


namespace MRF.DataAccess.Repository
{
    public class EmployeerolemapRepository: Repository<Employeerolemap>, IEmployeerolemapRepository
    {
        private readonly Data.MRFDBContext _db;
        public EmployeerolemapRepository(Data.MRFDBContext db) : base(db)
        {
            _db = db;
        }
        public void Update(Employeerolemap employeerolemap)
        {
            _db.Employeerolemap.Update(employeerolemap);
        }
        public List<Employeerolemap> GetEmployeebyRole(int roleId)
        {
            IQueryable<Employeerolemap> query = from emprole in _db.Employeerolemap
                                                join empdetails in _db.Employeedetails on emprole.EmployeeId equals empdetails.Id
                                                          where emprole.RoleId == roleId 
                                                          select new Employeerolemap
                                                          {
                                                              EmployeeId = emprole.EmployeeId,
                                                              name= empdetails.Name,
                                                              RoleId = emprole.RoleId,
                                                              EmployeeCode = empdetails.EmployeeCode,
                                                          };

            return query.ToList();

        }
    }
}
