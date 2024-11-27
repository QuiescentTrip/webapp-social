using Microsoft.AspNetCore.Mvc;
using SocialMediaApi.DAL;
using SocialMediaApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace SocialMediaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPostRepository _postRepository;

        public CommentController(
            ICommentRepository commentRepository,
            UserManager<ApplicationUser> userManager,
            IPostRepository postRepository)
        {
            _commentRepository = commentRepository;
            _userManager = userManager;
            _postRepository = postRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
        {
            var comments = await _commentRepository.GetAllComments();
            return Ok(comments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            var comment = await _commentRepository.GetCommentById(id);

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CommentDto>> PostComment([FromBody] CommentCreateDto commentData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var post = await _postRepository.GetPostById(commentData.PostId);
            if (post == null)
            {
                return NotFound("Post not found");
            }

            var comment = new Comment
            {
                Content = commentData.Content,
                Post = post,
                User = user,
                Created = DateTime.UtcNow
            };

            var createdComment = await _commentRepository.CreateComment(comment);
            if (createdComment == null)
            {
                return StatusCode(500, "Failed to create comment");
            }

            var commentDto = new CommentDto
            {
                Id = createdComment.Id,
                Content = createdComment.Content,
                Created = createdComment.Created,
                User = new UserDto
                {
                    Username = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    Name = user.Name
                }
            };

            return CreatedAtAction(nameof(GetComment), new { id = createdComment.Id }, commentDto);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var comment = await _commentRepository.GetCommentById(id);
            if (comment == null)
            {
                return NotFound();
            }

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            if (!isAdmin && comment.User.Id != user.Id)
            {
                return Forbid();
            }

            var result = await _commentRepository.DeleteComment(id);
            if (result)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500, "An error occurred while deleting the comment");
            }
        }
    }
}
