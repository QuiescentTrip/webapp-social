using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using SocialMediaApi.Controllers;
using SocialMediaApi.DAL;
using SocialMediaApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace SocialMediaApi.Tests
{
    public class LikeControllerTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
        private readonly ApplicationDbContext _context;
        private readonly LikeController _controller;

        public LikeControllerTests()
        {
			/* Create in-memory database to use for testing */
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabaseLikes")
                .Options;

			/* Create db context using our in-memory database */
            _context = new ApplicationDbContext(options);

			/* Mock for IUserStore */
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();

			/* We decided to mock all the dependencies of the UserManager
			   as not to get runtime errors or warnings, and to ensure proper testing */
			_userManagerMock = new Mock<UserManager<ApplicationUser>>(
				userStoreMock.Object,
				Mock.Of<IOptions<IdentityOptions>>(),
				Mock.Of<IPasswordHasher<ApplicationUser>>(),
				Array.Empty<IUserValidator<ApplicationUser>>(),
				Array.Empty<IPasswordValidator<ApplicationUser>>(),
				Mock.Of<ILookupNormalizer>(),
				Mock.Of<IdentityErrorDescriber>(),
				Mock.Of<IServiceProvider>(),
				Mock.Of<ILogger<UserManager<ApplicationUser>>>()
			);

            _controller = new LikeController(_context, _userManagerMock.Object);
        }

        /* Positive Test for LikePost - Post Liked */
		[Fact]
		public async Task LikePost_ValidData_ReturnsOk()
		{
            /* Arrange */
			var user = new ApplicationUser { Name = "Test User" };
			var post = new Post { Id = 1, Title = "Test Post", LikesCount = 0 , ImageUrl = "test", User = user};

            /* Propagate the post to the database */
			_context.Posts.Add(post);
			await _context.SaveChangesAsync();

            /* Mock the UserManager to return a predefined user for retrieval */
			_userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

            /* Act */
			var result = await _controller.LikePost(post.Id);

            /* Assert */
			var okResult = Assert.IsType<OkObjectResult>(result);
			var returnedValue = okResult.Value;
			Assert.NotNull(returnedValue);

			/* Get type from anonymous */
			var messageProperty = returnedValue.GetType().GetProperty("message")?.GetValue(returnedValue);

			Assert.Equal("Post liked successfully", messageProperty);
			Assert.Equal(1, post.LikesCount);
		}


        /* Negative Test for LikePost - Post not found */
		[Fact]
		public async Task LikePost_PostNotFound_ReturnsNotFound()
		{

            /* Arrange */
			var user = new ApplicationUser { Name = "Test User" };

            /* Mock the UserManager to return a predefined user for retrieval */
			_userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

            /* Act */
			var result = await _controller.LikePost(999);

            /* Assert */
			var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
			Assert.Equal("Post not found", notFoundResult.Value);
		}

        [Fact]
        public async Task LikePost_UserNotAuthenticated_ReturnsUnauthorized()
        {
            /* Arrange */
            /* Mock the UserManager to return a predefined user for retrieval */
            _userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync((ApplicationUser?)null);

            /* Act */
            var result = await _controller.LikePost(1);

            /* Assert */
            Assert.IsType<UnauthorizedResult>(result);
        }


        /* Positive Test for Unlike - Post unliked */
		[Fact]
		public async Task UnlikePost_AfterLiking_ReturnsOkAndDecrementsLikesCount()
		{
			/* Arrange */
			var user = new ApplicationUser { Name = "Test User" };
			var post = new Post { Id = 2, Title = "Test Post", User = user, ImageUrl = "https://via.placeholder.com/150" };

            /* Propagate the post to the database */
			_context.Posts.Add(post);
			await _context.SaveChangesAsync();

            /* Mock the UserManager to return a predefined user for retrieval */
			_userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

            /* Act */
            /* We first like the post */
			var likeResult = await _controller.LikePost(post.Id);
			Assert.IsType<OkObjectResult>(likeResult); // Ensure the like was successful

            /* Then we unlike the post */
			var result = await _controller.UnlikePost(post.Id);

            /* Assert */
			var okResult = Assert.IsType<OkObjectResult>(result);
			var returnedValue = okResult.Value;

			Assert.NotNull(returnedValue);

			/* Get type from anonymous */
			var messageProperty = returnedValue.GetType().GetProperty("message")?.GetValue(returnedValue);

			Assert.Equal("Post unliked successfully", messageProperty); // Check the message

			/* Check if LikesCount is decremented to 0 */
			var updatedPost = await _context.Posts.FindAsync(post.Id);
			Assert.NotNull(updatedPost);
			Assert.Equal(0, updatedPost.LikesCount);
		}

        /* Negative Test for Unlike - Post not found */
        [Fact]
        public async Task UnlikePost_PostNotFound_ReturnsNotFound()
        {

            /* Arrange */
            var user = new ApplicationUser { Name = "Test User" };

            /* Mock the UserManager to return a predefined user for retrieval */
            _userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

            /* Act */
            var result = await _controller.UnlikePost(999);

            /* Assert */
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Post not found", notFoundResult.Value);
        }

        /* Negative Test for Unauthenitcated Unlike - Unauthorized */
        [Fact]
        public async Task UnlikePost_UserNotAuthenticated_ReturnsUnauthorized()
        {
            /* Arrange */
            /* Mock the UserManager to return a predefined user for retrieval */
            _userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync((ApplicationUser?)null);

            /* Act */
            var result = await _controller.UnlikePost(1);

            /* Assert */
            Assert.IsType<UnauthorizedResult>(result);
        }

        /* Negative Test for Unliking post - Post never liked */
        [Fact]
        public async Task UnlikePost_NeverLiked_ReturnsBadRequest()
        {
			/* Arrange */
            var user = new ApplicationUser { Name = "Test User" };
			var post = new Post { Id = 3, Title = "Test Post", User = user, ImageUrl = "https://via.placeholder.com/150"};

            /* Propagate the post to the database */
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            /* Mock the UserManager to return a predefined user for retrieval */
            _userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

			/* Act */
            var result = await _controller.UnlikePost(post.Id);

			/* Assert */
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("You haven't liked this post", badRequestResult.Value);
        }
    }
}
