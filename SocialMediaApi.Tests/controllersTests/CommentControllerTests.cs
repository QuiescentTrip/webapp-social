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
    public class CommentControllerTests
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
        private readonly CommentController _controller;

		public CommentControllerTests()
		{

			/* Create in-memory database to use for testing */
			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(databaseName: "TestDatabaseComments")
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

			_controller = new CommentController(_context, _userManagerMock.Object);
		}

        /* Positive Test for GetComment - Valid Id */
        [Fact]
        public async Task GetComment_ValidId_ReturnsComment()
        {
            /* Arrange */
			var user = new ApplicationUser { Name = "Test User"};
			var post = new Post { Id = 1, Title = "Test Post", User = user, ImageUrl = "https://via.placeholder.com/150"};
			
			var comment = new Comment
			{
				Id = 1,
				Content = "Test comment",
				User = user,
				Post = post,

			};

            /* Propagate the comment to the database */
			_context.Comments.Add(comment);
			await _context.SaveChangesAsync();

            /* Act */
            var result = await _controller.GetComment(1);

            /* Assert */
            var okResult = Assert.IsType<ActionResult<Comment>>(result);
            Assert.NotNull(okResult.Value);

            /* We ensure that the correct object has been retrieved */
			var returnedComment = okResult.Value;
			Assert.Equal(comment.Id, returnedComment.Id);
			Assert.Equal(comment.Content, returnedComment.Content);
			Assert.Equal(comment.User.Name, returnedComment.User.Name);
			Assert.Equal(comment.Post.Title, returnedComment.Post.Title);
        }

        /* Negative Test for GetComment - Invalid Id */
        [Fact]
        public async Task GetComment_InvalidId_ReturnsNotFound()
        {
            /* In Memory database, nothing to arrange*/

            /* Act */
			/* We set arbitrary value to make sure it does not exist within in-memory database */
            var result = await _controller.GetComment(999);

            /* Assert */
            Assert.Null(result.Value);
        }

        /* Positive Test for PostComment - Valid Data */
        [Fact]
        public async Task PostComment_ValidData_ReturnsCreatedComment()
        {
            /* Arrange */
            var commentData = new CommentCreateDto { Content = "Test comment", PostId = 2 };
			var user = new ApplicationUser { Name = "Test User"};
			var post = new Post { Id = 2, Title = "Test Post", User = user, ImageUrl = "https://via.placeholder.com/150"};

            /* Propagate the comment to the database */
			_context.Posts.Add(post);
			await _context.SaveChangesAsync();

            /* Mock the UserManager to return a predefined user for retrieval */
            _userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user);

            /* Act */
            var result = await _controller.PostComment(commentData);

            /* Assert */
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("GetComment", createdAtActionResult.ActionName);

			var returnedComment = Assert.IsType<Comment>(createdAtActionResult.Value);
			Assert.Equal(commentData.Content, returnedComment.Content);
			Assert.Equal(user.Name, returnedComment.User.Name);
			Assert.Equal(post.Id, returnedComment.Post.Id);
        }

        /* Negative Test for PostComment - Unauthorized User */
        [Fact]
        public async Task PostComment_UnauthorizedUser_ReturnsUnauthorized()
        {
            /* Arrange */
            var commentData = new CommentCreateDto { Content = "Test comment", PostId = 3 };

            /* Mock the UserManager to return a predefined user for retrieval */
            _userManagerMock.Setup(u => u.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync((ApplicationUser?)null);

            /* Act */
            var result = await _controller.PostComment(commentData);

            /* Assert */
            Assert.IsType<UnauthorizedResult>(result.Result);
        }

        /* Positive Test for GetComments - Valid Request */
        [Fact]
        public async Task GetComments_ReturnsListOfComments()
        {

			/* Create new in-memory database to ensure isolation when retrieving amount of comments
			   so as not to confused amount of comments with database shared across functions. 
			   This makes testing more consistent if changing parameters in this very function */
			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(databaseName: "ReturnListOfCommentsDatabase")
				.Options;

			/* Create a new context and controller for this test */
			var context = new ApplicationDbContext(options);
			var controller = new CommentController(context, _userManagerMock.Object);
			
            /* Arrange */
			var user = new ApplicationUser { Name = "Test User"};
			var post = new Post { Id = 1, Title = "Test Post", User = user, ImageUrl = "https://via.placeholder.com/150"};
			
            var comments = new List<Comment> 
            {
				new Comment
				{
					Id = 1,
					Content = "Test comment1",
					User = user,
					Post = post,

				},
				new Comment
				{
					Id = 2,
					Content = "Test comment2",
					User = user,
					Post = post,

				},
            };

            /* Propagate the comments to the database */
			context.Comments.AddRange(comments);
			await context.SaveChangesAsync();

            /* Act */
            var result = await controller.GetComments();

            /* Assert */
			Assert.NotNull(result.Value);

			var returnedComments = Assert.IsType<List<Comment>>(result.Value);
            Assert.Equal(2, returnedComments.Count);
        }
    }
}
