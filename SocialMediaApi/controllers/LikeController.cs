using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SocialMediaApi.Models;
using SocialMediaApi.DAL;
using Microsoft.AspNetCore.Identity;

namespace SocialMediaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LikeController : ControllerBase
    {
        private readonly ILikeRepository _likeRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public LikeController(ILikeRepository likeRepository, UserManager<ApplicationUser> userManager)
        {
            _likeRepository = likeRepository;
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

            var hasLiked = await _likeRepository.HasUserLikedPost(postId, user.Id);
            if (hasLiked)
            {
                return BadRequest("You have already liked this post");
            }

            var result = await _likeRepository.AddLike(postId, user.Id);
            if (!result)
            {
                return NotFound("Post not found");
            }

            var likes = await _likeRepository.GetLikesByPost(postId);
            return Ok(new { message = "Post liked successfully", likes });
        }

        [HttpDelete("{postId}")]
        public async Task<IActionResult> UnlikePost(int postId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var hasLiked = await _likeRepository.HasUserLikedPost(postId, user.Id);
            if (!hasLiked)
            {
                return BadRequest("You haven't liked this post");
            }

            var result = await _likeRepository.RemoveLike(postId, user.Id);
            if (!result)
            {
                return NotFound("Post not found");
            }

            var likes = await _likeRepository.GetLikesByPost(postId);
            return Ok(new { message = "Post unliked successfully", likes });
        }
    }
}
