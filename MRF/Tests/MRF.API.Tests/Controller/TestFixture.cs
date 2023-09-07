﻿using MRF.DataAccess.Repository.IRepository;
using MRF.API.Controllers;
using Moq;
using MRF.Utility;


namespace MRF.API.Test.Controllers
{
    public class TestFixture
    {
        public Mock<IUnitOfWork> MockUnitOfWork { get; }
        public Mock<ILoggerService> MockLogger { get; }
        public Mock<IEmailService> MockEmailService { get; }
        public CandidatedetailController Controller { get; }

        public TestFixture()
        {
            MockUnitOfWork = new Mock<IUnitOfWork>();
            MockLogger = new Mock<ILoggerService>();
            MockEmailService = new Mock<IEmailService>();
            Controller = new CandidatedetailController(MockUnitOfWork.Object, MockLogger.Object, MockEmailService.Object);
        }
    }
}
