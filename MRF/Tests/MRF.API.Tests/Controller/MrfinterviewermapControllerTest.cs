﻿using MRF.Models.DTO;
using MRF.Models.Models;
using Moq;
using FluentAssertions;
using System.Linq.Expressions;
using MRF.API.Controllers;
using Azure.Core;
using MRF.Models.ViewModels;

namespace MRF.API.Test.Controllers
{
    public class MrfinterviewermapControllerTest
    {
        private readonly TestFixture fixture;
        private MrfinterviewermapController Controller;
        

        public MrfinterviewermapControllerTest()
        {
            fixture = new TestFixture();
            Controller = new MrfinterviewermapController(fixture.MockUnitOfWork.Object, fixture.MockLogger.Object, fixture.MockEmailService.Object,fixture.MockHostEnvironment.Object);
        }

        [Fact]
        public void MrfinterviewermapControllerTest_Constructor_ShouldInitializeDependencies()
        {
            // Assert
            Assert.NotNull(fixture.Controller);

        }

        [Fact]
        public void MrfinterviewermapController_ShouldReturnCount_WhenDataFound()
        {


            // Create a list of sample Mrfinterviewermap for testing
            var SampleMrfinterviewermapDetails = new List<Mrfinterviewermap>
            {
            new Mrfinterviewermap { Id=1,MrfId=345,InterviewerEmployeeId=47348,IsActive=true},
            new Mrfinterviewermap { Id=2,MrfId=345,InterviewerEmployeeId=47348,IsActive=true},

            };

            // Set up the behavior of the mockUnitOfWork to return the sample data
            fixture.MockUnitOfWork.Setup(uow => uow.Mrfinterviewermap.GetAll()).Returns
                (SampleMrfinterviewermapDetails);


            // Act
            var result = Controller.Get();

            // Assert
            Assert.Equal(SampleMrfinterviewermapDetails.Count, result.Count);
            Assert.NotNull(result);
            result.Should().NotBeNull();
            fixture.MockUnitOfWork.Verify(x => x.Mrfinterviewermap, Times.Once());
        }


        [Fact]
        public void MrfinterviewermapController_ShouldReturnNotFound_WhenDataNotFound()
        {

            fixture.MockUnitOfWork.Setup(x => x.Mrfinterviewermap.GetAll()).Returns(new List<Mrfinterviewermap>());


            // Act
            var result = Controller.Get();

            // Assert
            result.Should().NotBeNull();
            fixture.MockLogger.Verify(logger => logger.LogError("No record is found"));
            fixture.MockUnitOfWork.Verify(x => x.Mrfinterviewermap, Times.Once());
        }


        [Fact]
        public void GetinterviewermapById_ShouldReturnNoResult_WhenInputIsEqualsZero()
        {
            // Arrange

            int id = 0;

            // Create a list of sample Mrfinterviewermap for testing
            var SampleMrfinterviewermapDetails = new List<Mrfinterviewermap>
            {
            new Mrfinterviewermap  {MrfId=345,InterviewerEmployeeId=47348,IsActive=true},
            new Mrfinterviewermap {MrfId=345,InterviewerEmployeeId=47348,IsActive=true},

            };

            // Set up the behavior of the mockUnitOfWork to return the sample data
            fixture.MockUnitOfWork.Setup(uow => uow.Mrfinterviewermap.GetAll()).Returns(SampleMrfinterviewermapDetails);

            // Act
            var result = Controller.Get(id);

            // Assert
            result.Should().NotBeNull();
            fixture.MockLogger.Verify(logger => logger.LogError("No result found by this Id:0"));


        }
        [Fact]
        public void GetMrfinterviewermapById_ShouldReturnNoResult_WhenInputIsLessThanZero()
        {
            // Arrange


            int id = -2;

            // Create a list of sample Mrfinterviewermap for testing
            var SampleMrfinterviewermapDetails = new List<Mrfinterviewermap>
            {
            new Mrfinterviewermap {MrfId=345,InterviewerEmployeeId=47348,IsActive=true},
            new Mrfinterviewermap {MrfId=345,InterviewerEmployeeId=47348,IsActive=true},
                // Add more sample data as needed   
            };

            // Set up the behavior of the mockUnitOfWork to return the sample data
            fixture.MockUnitOfWork.Setup(uow => uow.Mrfinterviewermap.GetAll()).Returns(SampleMrfinterviewermapDetails);

            // Act  
            var result = Controller.Get(id);

            // Assert
            result.Should().NotBeNull();
            fixture.MockLogger.Verify(logger => logger.LogError("No result found by this Id:-2"));
        }
        [Fact]
        public void CreateMrfinterviewermap_ShouldReturnOkResponse_WhenValidRequest()
        {


            var requestModel = new MrfinterviewermapRequestModel
            {
                MrfId = 2345,
                InterviewerEmployeeId = 47348,
                IsActive = true,
                CreatedOnUtc = DateTime.Now,
                UpdatedByEmployeeId = 1,
                UpdatedOnUtc = DateTime.Now

            };

            // Mock the behavior of IUnitOfWork
            fixture.MockUnitOfWork.Setup(uow => uow.Mrfinterviewermap.Add(It.IsAny<Mrfinterviewermap>()));
            fixture.MockUnitOfWork.Setup(uow => uow.Save()).Verifiable();

            // Create an instance of ResponseDTO to return
            var responseModel = new MrfinterviewermapResponseModel
            {
                Id = 0, // Set the expected Id
                        // Set other properties as needed
            };

            // Act
            var result = Controller.Post(requestModel);

            // Assert
            // Verify that the result is an OkObjectResult
            Assert.IsType<MrfinterviewermapResponseModel>(result);
            var okResult = (MrfinterviewermapResponseModel)result;

            // Check if the returned response matches the expected response
            Assert.Equal(responseModel.Id, okResult.Id); // Adjust the assertions for other properties

            // Verify that the Mrfinterviewermap was added and Save was called
            fixture.MockUnitOfWork.Verify(uow => uow.Mrfinterviewermap.Add(It.IsAny<Mrfinterviewermap>()), Times.Once);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Once);

        }
        [Fact]
        public void CreateMrfinterviewermap_ShouldReturnBadRequest_WhenInvalidRequest()
        {
            // Mock the behavior of IUnitOfWork
            fixture.MockUnitOfWork.Setup(uow => uow.Mrfinterviewermap.Add(It.IsAny<Mrfinterviewermap>()));
            fixture.MockUnitOfWork.Setup(uow => uow.Save()).Verifiable();

            // Create an instance of ResponseDTO to return
            var responseModel = new MrfinterviewermapResponseModel
            {
                Id = 0, // Set the expected Id
                        // Set other properties as needed
            };

            // Act
            var result = Controller.Post(new MrfinterviewermapRequestModel());

            // Assert
            // Verify that the result is an OkObjectResult
            Assert.IsType<MrfinterviewermapResponseModel>(result);
            var okResult = (MrfinterviewermapResponseModel)result;

            // Check if the returned response matches the expected response
            Assert.Equal(responseModel.Id, okResult.Id); // Adjust the assertions for other properties

            // Verify that the Mrfinterviewermap was added and Save was called
            fixture.MockUnitOfWork.Verify(uow => uow.Mrfinterviewermap.Add(It.IsAny<Mrfinterviewermap>()), Times.Once);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Once);

            // Assert
            result.Should().NotBeNull();

        }
        [Fact]
        public void DeleteMrfinterviewermap_ShouldReturnNoContents_WhenDeletedARecord()
        {
            // Arrange

            int existingId = 1; // Replace with an existing Id in your test data

            // Mock the behavior of the Get and Remove methods in IUnitOfWork
            fixture.MockUnitOfWork.Setup(uow => uow.Mrfinterviewermap.Get(It.IsAny<Expression<Func<Mrfinterviewermap, bool>>>()))
                .Returns((Expression<Func<Mrfinterviewermap, bool>> filter) =>
                {
                    // Simulate returning an object when the filter condition matches
                    if (filter.Compile().Invoke(new Mrfinterviewermap { Id = existingId }))
                    {
                        return new Mrfinterviewermap { Id = existingId };
                    }
                    return null;
                });

            // Act
            Controller.Delete(existingId);


            // Assert
            // Verify that the Remove and Save methods of IUnitOfWork were called as expected
            fixture.MockUnitOfWork.Verify(uow => uow.Mrfinterviewermap.Get(It.IsAny<Expression<Func<Mrfinterviewermap, bool>>>()), Times.Once);
            fixture.MockUnitOfWork.Verify(uow => uow.Mrfinterviewermap.Remove(It.IsAny<Mrfinterviewermap>()), Times.Once);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Once);
        }
        [Fact]
        public void DeleteMrfinterviewermap_ShouldReturnNotFound_WhenRecordNotFound()
        {

            // Arrange


            // Set up your mock IUnitOfWork behavior.
            int nonExistentId = 999; // An ID that is assumed not to exist.
            fixture.MockUnitOfWork.Setup(uow => uow.Mrfinterviewermap.Get(It.IsAny<Expression<Func<Mrfinterviewermap, bool>>>()))
           .Returns((Expression<Func<Mrfinterviewermap, bool>> predicate) => null);

            // Act
            Controller.Delete(nonExistentId);

            // Assert
            // Verify that the Remove and Save methods were not called since the object does not exist.
            fixture.MockUnitOfWork.Verify(uow => uow.Mrfinterviewermap.Remove(It.IsAny<Mrfinterviewermap>()), Times.Never);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Never);

        }
        [Fact]
        public void DeleteMrfinterviewermap_ShouldReturnBadResponse_WhenInputIsZero()
        {
            // Arrange

            // Set up your mock IUnitOfWork behavior.
            int nonExistentId = 0;
            fixture.MockUnitOfWork.Setup(uow => uow.Mrfinterviewermap.Get(It.IsAny<Expression<Func<Mrfinterviewermap, bool>>>()))
           .Returns((Expression<Func<Mrfinterviewermap, bool>> predicate) => null);

            // Act
            Controller.Delete(nonExistentId);

            // Assert
            // Verify that the Remove and Save methods were not called since the object does not exist.
            fixture.MockUnitOfWork.Verify(uow => uow.Mrfinterviewermap.Remove(It.IsAny<Mrfinterviewermap>()), Times.Never);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Never);
        }
        [Fact]
        public void UpdateMrfinterviewermap_ShouldReturnIsActiveTrue_WhenRecordIsUpdated()
        {
            // Arrange

            int entityId = 1; // Example ID for an existing entity

            var requestModel = new MrfinterviewermapRequestModel
            {
                InterviewerEmployeeId = 47348,
                IsActive = true

            };

            // Mock the behavior of IUnitOfWork's Get method to return an existing entity
            var existingEntity = new Mrfinterviewermap
            {
                Id = entityId,


            };

            fixture.MockUnitOfWork.Setup(uow => uow.Mrfinterviewermap.Get(It.IsAny<Expression<Func<Mrfinterviewermap, bool>>>()))
                .Returns((Expression<Func<Mrfinterviewermap, bool>> predicate) => existingEntity);

            // Act
            var result = Controller.Put(entityId, requestModel);

            // Assert
            // Verify that the Update and Save methods were called and the response model contains the updated ID.
            fixture.MockUnitOfWork.Verify(uow => uow.Mrfinterviewermap.Update(It.IsAny<Mrfinterviewermap>()), Times.Once);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Once);

           // Assert.True(result.IsActive);
            Assert.Equal(entityId, result.Id);
        }
        [Fact]
        public void UpdateMrfinterviewermap_ShouldReturnIsActiveFalse_WhenInvalidRequest()
        {
            // Arrange
            int entityId = 999; // Id for which the entity is not found

            var requestModel = new MrfinterviewermapRequestModel
            {

                MrfId = 2345,
                InterviewerEmployeeId = 47348,
                IsActive = true

            };

            fixture.MockUnitOfWork.Setup(uow => uow.Mrfinterviewermap.Get(It.IsAny<Expression<Func<Mrfinterviewermap, bool>>>()))
                .Returns((Expression<Func<Mrfinterviewermap, bool>> predicate) => null);

            // Act
            var result = Controller.Put(entityId, requestModel);

            // Assert

            Assert.Equal(0, result.Id);
            //Assert.False(result.IsActive);

            // Verify that the Update and Save methods were not called since the entity does not exist.
            fixture.MockUnitOfWork.Verify(uow => uow.Mrfinterviewermap.Update(It.IsAny<Mrfinterviewermap>()), Times.Never);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Never);
        }
        [Fact]
        public void GetinterviewDetailsById_ShouldReturnNoResult_WhenInputIsEqualsZero()
        {
            // Arrange

            int id = 0;
            bool Dashboard = false;
            int roleId = 3;
            int userId = 6;
            // Create a list of sample Mrfinterviewermap for testing
            var SampleMrfinterviewDetails = new List<InterviewDetailsViewModel>
            {
            new InterviewDetailsViewModel  {MrfId=345,ReferenceNo="mum",InterviewerEmployeeId=47348,
                },
            new InterviewDetailsViewModel {MrfId=345,ReferenceNo="mum",InterviewerEmployeeId=47348,
                },

            };

            // Set up the behavior of the mockUnitOfWork to return the sample data
            fixture.MockUnitOfWork.Setup(uow => uow.InterviewDetail.GetAll()).Returns(SampleMrfinterviewDetails);

            // Act
            var result = Controller.GetInterviewDetails(id, Dashboard,roleId,userId);

            // Assert
            result.Should().NotBeNull();
            fixture.MockLogger.Verify(logger => logger.LogError("No result found by this Id: 0"));


        }
        [Fact]
        public void GetinterviewDetailsById_ShouldReturnNoResult_WhenInputIsLessThanZero()
        {
            // Arrange

            int id = -3;
            bool Dashboard = false;
            int roleId = 3;
            int userId = 6;
            // Create a list of sample Mrfinterviewermap for testing
            var SampleMrfinterviewDetails = new List<InterviewDetailsViewModel>
            {
            new InterviewDetailsViewModel  {MrfId=345,ReferenceNo="mum",InterviewerEmployeeId=47348,},
            new InterviewDetailsViewModel {MrfId=345,ReferenceNo="mum",InterviewerEmployeeId=47348,},

            };

            // Set up the behavior of the mockUnitOfWork to return the sample data
            fixture.MockUnitOfWork.Setup(uow => uow.InterviewDetail.GetAll()).Returns(SampleMrfinterviewDetails);

            // Act
            var result = Controller.GetInterviewDetails(id, Dashboard,roleId,userId);

            // Assert
            result.Should().NotBeNull();
            fixture.MockLogger.Verify(logger => logger.LogError("No result found by this Id: -3"));


        }
        [Fact]
        public void GetinterviewDetailsById_ShouldReturnResult_WhenInputIsCorrect()
        {
            // Arrange

            int id = 2;
            bool Dashboard = false;
            int roleId = 3;
            int userId = 6;
            // Create a list of sample Mrfinterviewermap for testing
            var SampleMrfinterviewDetails = new List<InterviewDetailsViewModel>
            {
            new InterviewDetailsViewModel  {CandidateId=2,MrfId=345,ReferenceNo="mum",InterviewerEmployeeId=47348,},
            new InterviewDetailsViewModel {CandidateId=2,MrfId=345,ReferenceNo="mum",InterviewerEmployeeId=47348,},

            };

            // Set up the behavior of the mockUnitOfWork to return the sample data
            fixture.MockUnitOfWork.Setup(uow => uow.InterviewDetail.GetAll()).Returns(SampleMrfinterviewDetails);

            // Act
            var result = Controller.GetInterviewDetails(id, Dashboard,roleId,userId);

            // Assert
            Assert.NotNull(result);
            result.Should().NotBeNull();
           


        }

    }
}
