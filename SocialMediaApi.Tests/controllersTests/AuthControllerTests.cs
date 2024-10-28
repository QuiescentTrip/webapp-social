using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using SocialMediaApi.Controllers;
using SocialMediaApi.Models;
using SocialMediaApi.Repositories;
using System.Text.Json;

namespace SocialMediaApi.Tests
{
    public class AuthControllerTests
    {

        /* Calls to AuthController and mock IAuthRepository */
        private readonly Mock<IAuthRepository> _authRepositoryMock;
        private readonly AuthController _controller;

        /* Constructor */
        public AuthControllerTests()
        {
            _authRepositoryMock = new Mock<IAuthRepository>();
            _controller = new AuthController(_authRepositoryMock.Object);
        }

        /* Positive Test for Register - User Successfully Registered */
        [Fact]
        public async Task Register_ValidModel_ReturnsOk()
        {
            /* Create DTO */
            var model = new RegisterDto
            {
                Username = "testuser",
                Email = "test@example.com",
                Password = "Password123!",
                Name = "Test User"
            };

            /* Mock Setup */
            _authRepositoryMock.Setup(repo => repo.FindUserByEmailAsync(model.Email))
                .ReturnsAsync((ApplicationUser?)null);

            _authRepositoryMock.Setup(repo => repo.CreateUserAsync(It.IsAny<ApplicationUser>(), model.Password))
                .ReturnsAsync(IdentityResult.Success);

            _authRepositoryMock.Setup(repo => repo.SignInAsync(It.IsAny<ApplicationUser>(), false))
                .Returns(Task.CompletedTask);

            /* Results from model */
            var result = await _controller.Register(model);

            /* Assertions */
            var okResult = Assert.IsType<OkObjectResult>(result);

			/* This serialization and deserialization effort is needed because in our controller we are
			returning anonymous objects instead of specified DTOs. We could make countless response-DTO files,
			but opted for this solution instead. */
			var jsonString = JsonSerializer.Serialize(okResult.Value);
			var returnValue = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonString);

			Assert.NotNull(returnValue);
            Assert.Equal(model.Username, returnValue["username"]);
            Assert.Equal(model.Email, returnValue["email"]);
        }

        /* Negative Test for Register - Email Already Exists */
        [Fact]
        public async Task Register_EmailAlreadyExists_ReturnsBadRequest()
        {
            /* Create DTO */
            var model = new RegisterDto
            {
                Username = "testuser",
                Email = "existing@example.com",
                Password = "Password123!",
                Name = "Test User"
            };

            /* Create entity */
            var existingUser = new ApplicationUser { Email = model.Email, Name = model.Name };

            /* Mock Setup */
            _authRepositoryMock.Setup(repo => repo.FindUserByEmailAsync(model.Email))
                .ReturnsAsync(existingUser);

            /* Result from model */
            var result = await _controller.Register(model);

            /* Assertions */
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var problemDetails = Assert.IsType<ValidationProblemDetails>(badRequestResult.Value);

            Assert.True(problemDetails.Errors.ContainsKey("Email"));
            Assert.Contains("Email is already in use", problemDetails.Errors["Email"]);
        }

        /* Positive Test for Login - User Successfully Logged In */
        [Fact]
        public async Task Login_ValidCredentials_ReturnsOk()
        {
            /* Create DTO */
            var model = new LoginDto
            {
                Email = "test@example.com",
                Password = "Password123!"
            };

            /* Create entity */
            var user = new ApplicationUser
            {
                UserName = "testuser",
                Email = model.Email,
				Name = "Test User"
            };

            /* Mock setup */
            _authRepositoryMock.Setup(repo => repo.FindUserByEmailAsync(model.Email))
                .ReturnsAsync(user);

            _authRepositoryMock.Setup(repo => repo.PasswordSignInAsync(user.UserName, model.Password, false, false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

            /* Results from model */
            var result = await _controller.Login(model);

            /* Assertions */
            var okResult = Assert.IsType<OkObjectResult>(result);

			/* This serialization and deserialization effort is needed because in our controller we are
			returning anonymous objects instead of specified DTOs. We could make countless response-DTO files,
			but opted for this solution instead. */
			var jsonString = JsonSerializer.Serialize(okResult.Value);
			var returnValue = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonString);

			Assert.NotNull(returnValue);
            Assert.Equal(user.UserName, returnValue["username"]);
            Assert.Equal(user.Email, returnValue["email"]);

        }

        /* Negative Test for Login - Invalid Credentials */
        [Fact]
        public async Task Login_InvalidCredentials_ReturnsBadRequest()
        {
            /* Create DTO */
            var model = new LoginDto
            {
                Email = "test@example.com",
                Password = "WrongPassword!"
            };

            /* Create entity */
            var user = new ApplicationUser
            {
                UserName = "testuser",
                Email = model.Email,
				Name = "Test User"
            };

            /* Mock Setup */
            _authRepositoryMock.Setup(repo => repo.FindUserByEmailAsync(model.Email))
                .ReturnsAsync(user);

            _authRepositoryMock.Setup(repo => repo.PasswordSignInAsync(user.UserName, model.Password, false, false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

            /* Result from model */
            var result = await _controller.Login(model);

            /* Assertions */
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var problemDetails = Assert.IsType<ValidationProblemDetails>(badRequestResult.Value);

            Assert.True(problemDetails.Errors.ContainsKey("Password"));
            Assert.Contains("Invalid email or password", problemDetails.Errors["Password"]);
        }

        /* Positive Test for Logout - Successfully Logged Out */
        [Fact]
        public async Task Logout_UserIsLoggedOut_ReturnsOk()
        {
            /* Mock setup */
            _authRepositoryMock.Setup(repo => repo.SignOutAsync())
                .Returns(Task.CompletedTask);

            /* Result from model */
            var result = await _controller.Logout();

            /* Assertions */
            var okResult = Assert.IsType<OkObjectResult>(result);

			/* This serialization and deserialization effort is needed because in our controller we are
			returning anonymous objects instead of specified DTOs. We could make countless response-DTO files,
			but opted for this solution instead. */
			var jsonString = JsonSerializer.Serialize(okResult.Value);
			var returnValue = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonString);

			Assert.NotNull(returnValue);
            Assert.Equal("User logged out successfully", returnValue["message"]);
        }

        /* Positive Test for GetUserInfo (Read) - Authorized User */
        [Fact]
        public async Task GetUserInfo_AuthorizedUser_ReturnsOk()
        {
            /* Create entity */
            var user = new ApplicationUser
            {
                UserName = "testuser",
                Email = "test@example.com",
				Name = "Test User"
            };

            /* Mock setup */
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "user-id")
            }, "mock"));

            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = userClaims }
            };

            _authRepositoryMock.Setup(repo => repo.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
                .ReturnsAsync(user);

            /* Results from model */
            var result = await _controller.GetUserInfo();

            /* Assertions */
            var okResult = Assert.IsType<OkObjectResult>(result);

			/* This serialization and deserialization effort is needed because in our controller we are
			returning anonymous objects instead of specified DTOs. We could make countless response-DTO files,
			but opted for this solution instead. */
			var jsonString = JsonSerializer.Serialize(okResult.Value);
			var returnValue = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonString);

			Assert.NotNull(returnValue);
            Assert.Equal(user.UserName, returnValue["username"]);
            Assert.Equal(user.Email, returnValue["email"]);

        }

        /* Negative Test for GetUserInfo - Unauthorized User */
        [Fact]
        public async Task GetUserInfo_UnauthorizedUser_ReturnsNoContent()
        {
            /* Mock setup */
            _authRepositoryMock.Setup(repo => repo.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
                .ReturnsAsync((ApplicationUser?)null);

            /* Results from model */
            var result = await _controller.GetUserInfo();

            /* Assertions */
            Assert.IsType<NoContentResult>(result);
        }

    }
}
