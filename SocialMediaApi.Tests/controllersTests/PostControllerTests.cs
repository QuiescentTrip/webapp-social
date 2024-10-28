using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
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
    public class PostControllerTests
    {
        private readonly Mock<IPostRepository> _postRepositoryMock;
        private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
        private readonly PostController _controller;

        public PostControllerTests()
        {

			/* Mock Post repository */
            _postRepositoryMock = new Mock<IPostRepository>();

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

            _controller = new PostController(_postRepositoryMock.Object, _userManagerMock.Object);
        }

        /* Positive Test for CreatePost - Post Created */
		[Fact]
		public async Task CreatePost_ValidData_ReturnsCreatedPost()
		{
            /* Arrange */
			var user = new ApplicationUser { Id = "1", Name = "Test User" };
			
            /* Here we are mocking a file upload as our controller requires a file
			   We set the name to testimage.jpg and byte size to 100 */
			var mockFile = new Mock<IFormFile>();
			mockFile.Setup(_ => _.FileName).Returns("testimage.jpg");
			mockFile.Setup(_ => _.Length).Returns(100);

            /* Create the data object */
			var postDto = new PostCreateDto 
			{ 
				Title = "New Post",
				Image = mockFile.Object
			};

            /* Mock the UserManager to return a predefined user for retrieval */
			_userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

			/* Mock the PostRepository to simulate successful post return when called */
			_postRepositoryMock.Setup(repo => repo.CreatePost(It.IsAny<Post>())).ReturnsAsync(true);

			/* Clear the model state */
			_controller.ModelState.Clear();

			/* Act */
			var result = await _controller.CreatePost(postDto);

			/* Assert */
			var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
			Assert.Equal("GetPost", createdAtActionResult.ActionName);
		}

        /* Positive Test for GetPost - Post Retrieved */
		[Fact]
		public async Task GetPost_ExistingId_ReturnsOk()
		{
            /* Arrange */
			var user = new ApplicationUser { Name = "Test User" };
			var post = new Post { Id = 1, Title = "Test Post", LikesCount = 0 , ImageUrl = "test", User = user};

			/* Mock the PostRepository to simulate successful post return when called */
			_postRepositoryMock.Setup(repo => repo.GetPostById(1)).ReturnsAsync(post);

            /* Act */
			var result = await _controller.GetPost(1);

            /* Assert */
			var okResult = Assert.IsType<OkObjectResult>(result);
			Assert.Equal(post, okResult.Value);
		}

        /* Negative Test for GetPost - Post Not Found */
		[Fact]
		public async Task GetPost_NonExistingId_ReturnsNotFound()
		{
            /* Arrange */
			/* Mock the PostRepository to simulate successful post return when called */
			_postRepositoryMock.Setup(repo => repo.GetPostById(1)).ReturnsAsync((Post?)null);

            /* Act */
			var result = await _controller.GetPost(1);

            /* Assert */
			Assert.IsType<NotFoundResult>(result);
		}

        /* Positive Test for GetAllPosts - All Posts Retrieved */
		[Fact]
		public async Task GetAllPosts_ReturnsListOfPosts()
		{
            /* Arrange */
			var user = new ApplicationUser { Name = "Test User" };

			var posts = new List<Post>
			{
				new Post { Id = 1, Title = "Post 1", User = user, ImageUrl = "url"},
				new Post { Id = 2, Title = "Post 2", User = user, ImageUrl = "url"}
			};

			/* Mock the PostRepository to simulate successful post return when called */
			_postRepositoryMock.Setup(repo => repo.GetAllPosts()).ReturnsAsync(posts);

            /* Act */
			var result = await _controller.GetAllPosts();

            /* Assert */
			var okResult = Assert.IsType<OkObjectResult>(result);
			var returnedPosts = Assert.IsAssignableFrom<IEnumerable<Post>>(okResult.Value);
			Assert.Equal(2, returnedPosts.Count());
		}

        /* Positive Test for DeletePost - Deletes Post */
		[Fact]
		public async Task DeletePost_ValidId_ReturnsNoContent()
		{
            /* Arrange */
			var user = new ApplicationUser { Id = "1", Name = "Test User" };
			var post = new Post { Id = 1, Title = "Post to Delete", User = user, ImageUrl = "url"};

            /* Mock the UserManager to return a predefined user for retrieval */
			_userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

			/* Mock the PostRepository to simulate successful post return when called */
			_postRepositoryMock.Setup(repo => repo.GetPostById(1)).ReturnsAsync(post);
			_postRepositoryMock.Setup(repo => repo.DeletePost(1)).ReturnsAsync(true);

            /* Act */
			var result = await _controller.DeletePost(1);

            /* Assert */
			Assert.IsType<NoContentResult>(result);
		}

        /* Negative Test for DeletePost - Post Not Found */
		[Fact]
		public async Task DeletePost_NonExistingId_ReturnsNotFound()
		{
            /* Arrange */
			var user = new ApplicationUser { Id = "1", Name = "Test User" };

            /* Mock the UserManager to return a predefined user for retrieval */
			_userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

			/* Mock the PostRepository to simulate successful post return when called */
			_postRepositoryMock.Setup(repo => repo.GetPostById(1)).ReturnsAsync((Post?)null);

            /* Act */
			var result = await _controller.DeletePost(1);

            /* Assert */
			Assert.IsType<NotFoundResult>(result);
		}

        /* Negative Test for DeletePost - Not owner of post, forbidden */
		[Fact]
		public async Task DeletePost_UserNotOwner_ReturnsForbidden()
		{
            /* Arrange */
			var user = new ApplicationUser { Id = "1", Name = "Test User" };
			var otherUser = new ApplicationUser { Id = "2", Name = "Other User" };
			var post = new Post { Id = 1, Title = "Post to Delete", User = otherUser, ImageUrl = "url"};

            /* Mock the UserManager to return a predefined user for retrieval */
			_userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

			/* Mock the PostRepository to simulate successful post return when called */
			_postRepositoryMock.Setup(repo => repo.GetPostById(1)).ReturnsAsync(post);

            /* Act */
			var result = await _controller.DeletePost(1);

            /* Assert */
			Assert.IsType<ForbidResult>(result);
		}

        /* Positive Test for UpdatePost - Post Updated */
		[Fact]
		public async Task UpdatePost_ValidData_ReturnsOk()
		{
            /* Arrange */
			var user = new ApplicationUser { Id = "1", Name = "Test User" };
			var post = new Post { Id = 1, Title = "Old Title", User = user, ImageUrl = "url"};
			var updateDto = new PostUpdateDto { Title = "Updated Title" };
			
            /* Mock the UserManager to return a predefined user for retrieval */
			_userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

			/* Mock the PostRepository to simulate successful post return when called */
			_postRepositoryMock.Setup(repo => repo.GetPostById(1)).ReturnsAsync(post);
			_postRepositoryMock.Setup(repo => repo.UpdatePost(post)).ReturnsAsync(true);

            /* Act */
			var result = await _controller.UpdatePost(1, updateDto);

            /* Assert */
			var okResult = Assert.IsType<OkObjectResult>(result);
			Assert.NotNull(okResult.Value);
			Assert.Equal("Updated Title", ((Post)okResult.Value).Title);
		}

        /* Negative Test for UpdatePost - Post Not Found */
		[Fact]
		public async Task UpdatePost_NonExistingId_ReturnsNotFound()
		{
            /* Arrange */
			var user = new ApplicationUser { Id = "1", Name = "Test User" };
			var updateDto = new PostUpdateDto { Title = "Updated Title" };
			
            /* Mock the UserManager to return a predefined user for retrieval */
			_userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

			/* Mock the PostRepository to simulate successful post return when called */
			_postRepositoryMock.Setup(repo => repo.GetPostById(1)).ReturnsAsync((Post?)null);

            /* Act */
			var result = await _controller.UpdatePost(1, updateDto);

            /* Assert */
			Assert.IsType<NotFoundResult>(result);
		}

        /* Negative Test for UpdatePost - Not owner of post, forbidden */
		[Fact]
		public async Task UpdatePost_UserNotOwner_ReturnsForbidden()
		{
            /* Arrange */
			var user = new ApplicationUser { Id = "1", Name = "Test User" };
			var otherUser = new ApplicationUser { Id = "2", Name = "Other User" };
			var post = new Post { Id = 1, Title = "Old Title", User = otherUser, ImageUrl = "url"};
			var updateDto = new PostUpdateDto { Title = "Updated Title" };

            /* Mock the UserManager to return a predefined user for retrieval */
			_userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);
			
			/* Mock the PostRepository to simulate successful post return when called */
			_postRepositoryMock.Setup(repo => repo.GetPostById(1)).ReturnsAsync(post);

            /* Act */
			var result = await _controller.UpdatePost(1, updateDto);

            /* Assert */
			Assert.IsType<ForbidResult>(result);
		}
    }
}
