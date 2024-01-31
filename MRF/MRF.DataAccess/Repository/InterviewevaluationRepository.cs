using MRF.DataAccess.Repository.IRepository;
using MRF.Models.DTO;
using MRF.Models.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MRF.DataAccess.Repository
{
    public class InterviewevaluationRepository : Repository<Interviewevaluation>, IInterviewevaluationRepository
    {

        private readonly Data.MRFDBContext _db;
        public InterviewevaluationRepository(Data.MRFDBContext db) : base(db)
        {
            _db = db;
        }

        public void Update(Interviewevaluation interviewevaluation)
        {
            _db.Interviewevaluation.Update(interviewevaluation);
        }

        public List<Interviewevaluation> GetCandidateByCandidateid(int candidateId )
        {
            IQueryable<Interviewevaluation> query = from interview in _db.Interviewevaluation where interview.CandidateId == candidateId  
                                                    select interview;
            return query.ToList();
        }
    }
}








