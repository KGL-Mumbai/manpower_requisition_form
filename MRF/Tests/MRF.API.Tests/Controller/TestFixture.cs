using MRF.DataAccess.Repository.IRepository;
using MRF.API.Controllers;
using Moq;
using MRF.Utility;
using Microsoft.Extensions.Hosting;
using MRF.DataAccess.Repository;
using Microsoft.Extensions.Configuration;

namespace MRF.API.Test.Controllers
{
    public class TestFixture
    {
        public Mock<IUnitOfWork> MockUnitOfWork { get; }
        public Mock<ILoggerService> MockLogger { get; }
        public Mock<ISmtpEmailService> MockEmailService { get; }
        public CandidatedetailController Controller { get; }

        public Mock<IHostEnvironment> MockHostEnvironment { get; }
        public Mock<IUserService> MockUserService { get; }
        public Mock<IConfiguration> Mockconfiguration { get; }
         
        public TestFixture()
        {
            MockUnitOfWork = new Mock<IUnitOfWork>();
            MockLogger = new Mock<ILoggerService>();
            MockEmailService = new Mock<ISmtpEmailService>();
            MockHostEnvironment = new Mock<IHostEnvironment>();
            MockUserService = new Mock<IUserService>();
            Mockconfiguration = new Mock<IConfiguration>();

            Controller = new CandidatedetailController(MockUnitOfWork.Object, MockLogger.Object, MockEmailService.Object,MockHostEnvironment.Object);
        }
    }
}
