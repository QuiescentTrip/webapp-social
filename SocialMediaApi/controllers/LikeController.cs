using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SocialMediaApi.Models;
using SocialMediaApi.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace SocialMediaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LikeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public LikeController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("{postId}")]
        public async Task<IActionResult> LikePost(int postId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound("Post not found");
            }

            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.Post == post && l.User == user);

            if (existingLike != null)
            {
                return BadRequest("You have already liked this post");
            }

            var like = new Like
            {
                Post = post,
                User = user
            };

            _context.Likes.Add(like);
            post.LikesCount++;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Post liked successfully", likes = post.Likes });
        }

        [HttpDelete("{postId}")]
        public async Task<IActionResult> UnlikePost(int postId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound("Post not found");
            }

            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.Post == post && l.User == user);

            if (existingLike == null)
            {
                return BadRequest("You haven't liked this post");
            }

            _context.Likes.Remove(existingLike);
            post.LikesCount--;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Post unliked successfully", likes = post.Likes });
        }
    }
}
