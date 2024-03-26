using MRF.DataAccess.Repository.IRepository;
using MRF.Models.Models;

namespace MRF.DataAccess.Repository
{
    public class EmployeedetailsRepository : Repository<Employeedetails>, IEmployeedetailsRepository
    {
        private readonly Data.MRFDBContext _db;
        public EmployeedetailsRepository(Data.MRFDBContext db) : base(db)
        {
            _db = db;
        }
        public void Update(Employeedetails employeedetails)
        {
            _db.Employeedetails.Update(employeedetails);
        }
        public List<Employeedetails> GetEmployee(int id)
        {
            IQueryable<Employeedetails> query = from empdetails in _db.Employeedetails
                                                join emprole in _db.Employeerolemap on empdetails.Id equals emprole.EmployeeId
                                                join role in _db.Rolemaster on emprole.RoleId equals role.Id
                                                where (id == 0 || (id != 0 && empdetails.Id == id))
                                                select new Employeedetails
                                                {
                                                    Id = empdetails.Id,
                                                    Name = empdetails.Name,
                                                    Email = empdetails.Email,
                                                    ContactNo = empdetails.ContactNo,
                                                    RoleName = role.Name,
                                                    RoleId = emprole.RoleId,
                                                    EmployeeCode = empdetails.EmployeeCode,
                                                    IsAllowed = empdetails.IsAllowed,
                                                    IsDeleted = empdetails.IsDeleted,
                                                    AllowedByEmployeeId = empdetails.AllowedByEmployeeId,
                                                    CreatedByEmployeeId = empdetails.CreatedByEmployeeId,
                                                    UpdatedOnUtc = empdetails.UpdatedOnUtc,
                                                    multipleRoleIds = emprole.multipleRoleIds,

                                                };


            return query.ToList();

        }

        public List<Employeedetails> GetAllEmpRoleWithEmpCode()
        {
            IQueryable<Employeedetails> query = from er in _db.Employeerolemap
                                                join ed in _db.Employeedetails on er.EmployeeId equals ed.Id
                                                select new Employeedetails
                                                {
                                                    Id = ed.Id,
                                                    Name = ed.Name,
                                                    Email = ed.Email,
                                                    RoleId = er.RoleId,
                                                    multipleRoleIds=er.multipleRoleIds,
                                                    ContactNo = ed.ContactNo,
                                                    EmployeeCode = ed.EmployeeCode,
                                                    IsAllowed = ed.IsAllowed,
                                                    IsDeleted = ed.IsDeleted,
                                                    AllowedByEmployeeId = ed.AllowedByEmployeeId,
                                                    CreatedByEmployeeId = ed.CreatedByEmployeeId,
                                                    UpdatedOnUtc = ed.UpdatedOnUtc,
                                                };
            return query.ToList();

        }

        public List<Employeedetails> GetEmployeeByEmpCode(int empcode)
        {
            IQueryable<Employeedetails> query = from er in _db.Employeerolemap
                                                join ed in _db.Employeedetails on er.EmployeeId equals ed.Id
                                                where ed.EmployeeCode == empcode
                                                select new Employeedetails
                                                {
                                                    Id = ed.Id,
                                                    Name = ed.Name,
                                                    Email = ed.Email,
                                                    RoleId = er.RoleId,
                                                    ContactNo = ed.ContactNo,
                                                    EmployeeCode = ed.EmployeeCode,
                                                    IsAllowed = ed.IsAllowed,
                                                    IsDeleted = ed.IsDeleted,
                                                    AllowedByEmployeeId = ed.AllowedByEmployeeId,
                                                    CreatedByEmployeeId = ed.CreatedByEmployeeId,
                                                    UpdatedOnUtc = ed.UpdatedOnUtc,
                                                };
            return query.ToList();
        }
    }
}


