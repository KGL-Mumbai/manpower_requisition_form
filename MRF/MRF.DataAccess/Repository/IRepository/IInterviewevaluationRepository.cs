using MRF.Models.Models;

namespace MRF.DataAccess.Repository.IRepository
{
    public interface IInterviewevaluationRepository : IRepository<Interviewevaluation>
    {
        public void Update(Interviewevaluation interviewevaluation);
        public List<Interviewevaluation> GetCandidateByCandidateid(int candidateId );
         
    }
}