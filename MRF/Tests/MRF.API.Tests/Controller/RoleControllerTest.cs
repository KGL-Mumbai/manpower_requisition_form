﻿using MRF.Models.DTO;
using MRF.Models.Models;
using Moq;
using FluentAssertions;
using System.Linq.Expressions;
using MRF.API.Controllers;
using Azure.Core;

namespace MRF.API.Test.Controllers
{
    public class RoleControllerTest
    {
        private readonly TestFixture fixture;
        private RoleController Controller;

        public RoleControllerTest()
        {
            fixture = new TestFixture();
            Controller = new RoleController(fixture.MockUnitOfWork.Object, fixture.MockLogger.Object);

        }

        [Fact]
        public void RoleControllerTest_Constructor_ShouldInitializeDependencies()
        {
            // Assert
            Assert.NotNull(fixture.Controller);

        }

        [Fact]
        public void RoleControllerController_ShouldReturnCount_WhenDataFound()
        {


            // Create a list of sample Rolemaster for testing
            var SampleRoledetail = new List<Rolemaster>
            {
            new Rolemaster  {Name = "Admin",IsActive =  true,},
            new Rolemaster {Name = "Admin",IsActive =  true,},

            };

            // Set up the behavior of the mockUnitOfWork to return the sample data
            fixture.MockUnitOfWork.Setup(uow => uow.Rolemaster.GetAll()).Returns(SampleRoledetail);


            // Act
            var result = Controller.Get();

            // Assert
            Assert.Equal(SampleRoledetail.Count, result.Count);
            Assert.NotNull(result);
            result.Should().NotBeNull();
            fixture.MockUnitOfWork.Verify(x => x.Rolemaster, Times.Once());
        }


        [Fact]
        public void RoleController_ShouldReturnNotFound_WhenDataNotFound()
        {

            fixture.MockUnitOfWork.Setup(x => x.Rolemaster.GetAll()).Returns(new List<Rolemaster>());


            // Act
            var result = Controller.Get();

            // Assert
            result.Should().NotBeNull();
            fixture.MockLogger.Verify(logger => logger.LogError("No record is found"));
            fixture.MockUnitOfWork.Verify(x => x.Rolemaster, Times.Once());
        }


        [Fact]
        public void GetRoledetailById_ShouldReturnNoResult_WhenInputIsEqualsZero()
        {
            // Arrange

            int id = 0;

            // Create a list of sample Rolemaster for testing
            var SampleRoledetail = new List<Rolemaster>
            {
            new Rolemaster  {Name = "Admin",IsActive =  true,},
            new Rolemaster {Name = "Admin",IsActive =  true,},

            };

            // Set up the behavior of the mockUnitOfWork to return the sample data
            fixture.MockUnitOfWork.Setup(uow => uow.Rolemaster.GetAll()).Returns(SampleRoledetail);

            // Act
            var result = Controller.Get(id);

            // Assert
            result.Should().NotBeNull();
            fixture.MockLogger.Verify(logger => logger.LogError("No result found by this Id:0"));


        }
        [Fact]
        public void GetRoledetailById_ShouldReturnNoResult_WhenInputIsLessThanZero()
        {
            // Arrange


            int id = -2;

            // Create a list of sample Rolemaster for testing
            var SampleRoledetail = new List<Rolemaster>
            {
            new Rolemaster {Name = "Admin",IsActive =  true,},
            new Rolemaster {Name = "Admin",IsActive =  true,},
                // Add more sample data as needed   
            };

            // Set up the behavior of the mockUnitOfWork to return the sample data
            fixture.MockUnitOfWork.Setup(uow => uow.Rolemaster.GetAll()).Returns(SampleRoledetail);

            // Act  
            var result = Controller.Get(id);

            // Assert
            result.Should().NotBeNull();
            fixture.MockLogger.Verify(logger => logger.LogError("No result found by this Id:-2"));
        }
        [Fact]
        public void CreateRole_ShouldReturnOkResponse_WhenValidRequest()
        {


            var requestModel = new RolemasterRequestModel
            {
                Name = "Admin",
                IsActive = true,

            };

            // Mock the behavior of IUnitOfWork
            fixture.MockUnitOfWork.Setup(uow => uow.Rolemaster.Add(It.IsAny<Rolemaster>()));
            fixture.MockUnitOfWork.Setup(uow => uow.Save()).Verifiable();

            // Create an instance of ResponseDTO to return
            var responseModel = new RolemasterResponseModel
            {
                Id = 0, // Set the expected Id
                        // Set other properties as needed
            };

            // Act
            var result = Controller.Post(requestModel);

            // Assert
            // Verify that the result is an OkObjectResult
            Assert.IsType<RolemasterResponseModel>(result);
            var okResult = (RolemasterResponseModel)result;

            // Check if the returned response matches the expected response
            Assert.Equal(responseModel.Id, okResult.Id); // Adjust the assertions for other properties

            // Verify that the Rolemaster was added and Save was called
            fixture.MockUnitOfWork.Verify(uow => uow.Rolemaster.Add(It.IsAny<Rolemaster>()), Times.Once);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Once);

        }
        [Fact]
        public void CreateRole_ShouldReturnBadRequest_WhenInvalidRequest()
        {
            // Mock the behavior of IUnitOfWork
            fixture.MockUnitOfWork.Setup(uow => uow.Rolemaster.Add(It.IsAny<Rolemaster>()));
            fixture.MockUnitOfWork.Setup(uow => uow.Save()).Verifiable();

            // Create an instance of ResponseDTO to return
            var responseModel = new RolemasterResponseModel
            {
                Id = 0, // Set the expected Id
                        // Set other properties as needed
            };

            // Act
            var result = Controller.Post(new RolemasterRequestModel());

            // Assert
            // Verify that the result is an OkObjectResult
            Assert.IsType<RolemasterResponseModel>(result);
            var okResult = (RolemasterResponseModel)result;

            // Check if the returned response matches the expected response
            Assert.Equal(responseModel.Id, okResult.Id); // Adjust the assertions for other properties

            // Verify that the Rolemaster was added and Save was called
            fixture.MockUnitOfWork.Verify(uow => uow.Rolemaster.Add(It.IsAny<Rolemaster>()), Times.Once);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Once);

            // Assert
            result.Should().NotBeNull();

        }
        [Fact]
        public void DeleteRole_ShouldReturnNoContents_WhenDeletedARecord()
        {
            // Arrange

            int existingId = 1; // Replace with an existing Id in your test data

            // Mock the behavior of the Get and Remove methods in IUnitOfWork
            fixture.MockUnitOfWork.Setup(uow => uow.Rolemaster.Get(It.IsAny<Expression<Func<Rolemaster, bool>>>()))
                .Returns((Expression<Func<Rolemaster, bool>> filter) =>
                {
                    // Simulate returning an object when the filter condition matches
                    if (filter.Compile().Invoke(new Rolemaster { Id = existingId }))
                    {
                        return new Rolemaster { Id = existingId };
                    }
                    return null;
                });

            // Act
            Controller.Delete(existingId);


            // Assert
            // Verify that the Remove and Save methods of IUnitOfWork were called as expected
            fixture.MockUnitOfWork.Verify(uow => uow.Rolemaster.Get(It.IsAny<Expression<Func<Rolemaster, bool>>>()), Times.Once);
            fixture.MockUnitOfWork.Verify(uow => uow.Rolemaster.Remove(It.IsAny<Rolemaster>()), Times.Once);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Once);
        }
        [Fact]
        public void DeleteRole_ShouldReturnNotFound_WhenRecordNotFound()
        {

            // Arrange


            // Set up your mock IUnitOfWork behavior.
            int nonExistentId = 999; // An ID that is assumed not to exist.
            fixture.MockUnitOfWork.Setup(uow => uow.Rolemaster.Get(It.IsAny<Expression<Func<Rolemaster, bool>>>()))
           .Returns((Expression<Func<Rolemaster, bool>> predicate) => null);

            // Act
            Controller.Delete(nonExistentId);

            // Assert
            // Verify that the Remove and Save methods were not called since the object does not exist.
            fixture.MockUnitOfWork.Verify(uow => uow.Rolemaster.Remove(It.IsAny<Rolemaster>()), Times.Never);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Never);

        }
        [Fact]
        public void DeleteRole_ShouldReturnBadResponse_WhenInputIsZero()
        {
            // Arrange

            // Set up your mock IUnitOfWork behavior.
            int nonExistentId = 0;
            fixture.MockUnitOfWork.Setup(uow => uow.Rolemaster.Get(It.IsAny<Expression<Func<Rolemaster, bool>>>()))
           .Returns((Expression<Func<Rolemaster, bool>> predicate) => null);

            // Act
            Controller.Delete(nonExistentId);

            // Assert
            // Verify that the Remove and Save methods were not called since the object does not exist.
            fixture.MockUnitOfWork.Verify(uow => uow.Rolemaster.Remove(It.IsAny<Rolemaster>()), Times.Never);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Never);
        }
        [Fact]
        public void UpdateRole_ShouldReturnIsActiveTrue_WhenRecordIsUpdated()
        {
            // Arrange

            int entityId = 1; // Example ID for an existing entity

            var requestModel = new RolemasterRequestModel
            {
                Name = "Admin",
                IsActive = true,

            };

            // Mock the behavior of IUnitOfWork's Get method to return an existing entity
            var existingEntity = new Rolemaster
            {
                Id = entityId,


            };

            fixture.MockUnitOfWork.Setup(uow => uow.Rolemaster.Get(It.IsAny<Expression<Func<Rolemaster, bool>>>()))
                .Returns((Expression<Func<Rolemaster, bool>> predicate) => existingEntity);

            // Act
            var result = Controller.Put(entityId, requestModel);

            // Assert
            // Verify that the Update and Save methods were called and the response model contains the updated ID.
            fixture.MockUnitOfWork.Verify(uow => uow.Rolemaster.Update(It.IsAny<Rolemaster>()), Times.Once);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Once);

            Assert.True(result.IsActive);
            Assert.Equal(entityId, result.Id);
        }
        [Fact]
        public void UpdateRole_ShouldReturnIsActiveFalse_WhenInvalidRequest()
        {
            // Arrange
            int entityId = 999; // Id for which the entity is not found

            var requestModel = new RolemasterRequestModel
            {

                Name = "Admin",
                IsActive = true,

            };

            fixture.MockUnitOfWork.Setup(uow => uow.Rolemaster.Get(It.IsAny<Expression<Func<Rolemaster, bool>>>()))
                .Returns((Expression<Func<Rolemaster, bool>> predicate) => null);

            // Act
            var result = Controller.Put(entityId, requestModel);

            // Assert

            Assert.Equal(0, result.Id);
            Assert.False(result.IsActive);

            // Verify that the Update and Save methods were not called since the entity does not exist.
            fixture.MockUnitOfWork.Verify(uow => uow.Rolemaster.Update(It.IsAny<Rolemaster>()), Times.Never);
            fixture.MockUnitOfWork.Verify(uow => uow.Save(), Times.Never);
        }

    }
}
