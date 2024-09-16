using Microsoft.AspNetCore.Mvc;
using SocialMediaApi.DAL;
using SocialMediaApi.Models;

namespace SocialMediaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly IPostRepository _postRepository;

        public PostController(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] Post post)
        {
            if (post == null)
            {
                return BadRequest("Post data is null");
            }

            post.Created = DateTime.UtcNow;
            var result = await _postRepository.CreatePost(post);

            if (result)
            {
                return CreatedAtAction(nameof(CreatePost), new { id = post.Id }, post);
            }
            else
            {
                return StatusCode(500, "An error occurred while creating the post");
            }
        }
    }
}