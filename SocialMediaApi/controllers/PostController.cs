using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<ApplicationUser> _userManager;

        public PostController(IPostRepository postRepository, UserManager<ApplicationUser> userManager)
        {
            _postRepository = postRepository;
            _userManager = userManager;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] PostCreateDto postDto)
        {
            Console.WriteLine(postDto);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return Unauthorized();
            }

            // Handle file upload
            if (postDto.Image != null && postDto.Image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(postDto.Image.FileName);
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                // Ensure the uploads folder exists
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await postDto.Image.CopyToAsync(stream);
                }

                var post = new Post
                {
                    Title = postDto.Title,
                    User = user,
                    Created = DateTime.UtcNow,
                    ImageUrl = $"/uploads/{fileName}"
                };

                var result = await _postRepository.CreatePost(post);

                if (result)
                {
                    return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
                }
                else
                {
                    return StatusCode(500, "An error occurred while creating the post");
                }
            }
            else
            {
                return BadRequest("An image is required to create a post.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _postRepository.GetPostById(id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _postRepository.GetAllPosts();
            return Ok(posts);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var post = await _postRepository.GetPostById(id);
            if (post == null)
            {
                return NotFound();
            }

            if (post.User.Id != user.Id)
            {
                return Forbid();
            }

            var result = await _postRepository.DeletePost(id);
            if (result)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500, "An error occurred while deleting the post");
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] PostUpdateDto postDto)
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

            var existingPost = await _postRepository.GetPostById(id);
            if (existingPost == null)
            {
                return NotFound();
            }

            if (existingPost.User.Id != user.Id)
            {
                return Forbid();
            }

            existingPost.Title = postDto.Title;

            var result = await _postRepository.UpdatePost(existingPost);
            if (result)
            {
                return Ok(existingPost);
            }
            else
            {
                return StatusCode(500, "An error occurred while updating the post");
            }
        }
    }
}