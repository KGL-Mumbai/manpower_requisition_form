using MRF.Models.DTO;
using MRF.Models.Models;

namespace MRF.DataAccess.Repository.IRepository
{
    public interface IMrfdetailsPDFRepository : IRepository<MrfdetailsPDF>
    { 
        public MrfdetailsEmailRequestModel GetRequisition(int MrfId);
        //public Task<MrfdetailsEmailRequestModel> GetRequisition(int MrfId);
    }
}
