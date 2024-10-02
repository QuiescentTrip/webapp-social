using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApi.Controllers;
using SocialMediaApi.Models;
using SocialMediaApi.Repositories;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

public class AuthControllerTests
{

    [Fact]
    public async Task Register_ValidModel_ReturnsOkResult()
    {

        var mockRepo = new Mock<IAuthRepository>();
        var authController = new AuthController(mockRepo.Object);
        
        var registerDto = new RegisterDto
        {
            Email = "test@example.com",
            Name = "Test User",
            Username = "testuser",
            Password = "Password@123"
        };

        mockRepo.Setup(repo => repo.FindUserByEmailAsync(It.IsAny<string>())).ReturnsAsync((ApplicationUser?)null);
        mockRepo.Setup(repo => repo.CreateUserAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);
        mockRepo.Setup(repo => repo.SignInAsync(It.IsAny<ApplicationUser>(), false)).Returns(Task.CompletedTask);

        // Act
        var result = await authController.Register(registerDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        var jsonString = JsonSerializer.Serialize(okResult.Value);
        
        // Cast result to dynamic to access anonymous type properties
        var response = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonString);
        Assert.Equal("testuser", response["username"]);
        Assert.Equal("test@example.com", response["email"]);
    }

    [Fact]
    public async Task Register_EmailAlreadyInUse_ReturnsBadRequest()
    {
        // Arrange
        var mockRepo = new Mock<IAuthRepository>();
        var authController = new AuthController(mockRepo.Object);
        
        var registerDto = new RegisterDto
        {
            Email = "test@example.com",
            Name = "Test User",
            Username = "testuser",
            Password = "Password@123"
        };

        var existingUser = new ApplicationUser { Email = "test@example.com", UserName = "existinguser", Name = "Existing User" };
        mockRepo.Setup(repo => repo.FindUserByEmailAsync(It.IsAny<string>())).ReturnsAsync(existingUser);

        // Act
        var result = await authController.Register(registerDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        var validationDetails = Assert.IsType<ValidationProblemDetails>(badRequestResult.Value);
        Assert.Contains("Email", validationDetails.Errors.Keys);
    }
}
