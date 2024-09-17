using Microsoft.EntityFrameworkCore;
using SocialMediaApi.Models;

namespace SocialMediaApi.DAL
{
    public class PostRepository : IPostRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PostRepository> _logger;

        public PostRepository(ApplicationDbContext context, ILogger<PostRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Post>> GetAllPosts()
        {
            try
            {
                return await _context.Posts.Include(p => p.Comments).ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in GetAllPosts: {e.Message}");
                return Enumerable.Empty<Post>();
            }
        }

        public async Task<Post?> GetPostById(int id)
        {
            try
            {
                return await _context.Posts.Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == id);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in GetPostById: {e.Message}");
                return null;
            }
        }

        public async Task<bool> CreatePost(Post post)
        {
            try
            {
                _context.Posts.Add(post);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine($"{e}");
                _logger.LogError($"Error in CreatePost: {e.Message}");
                return false;
            }
        }

        public async Task<bool> UpdatePost(Post post)
        {
            try
            {
                _context.Entry(post).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in UpdatePost: {e.Message}");
                return false;
            }
        }

        public async Task<bool> DeletePost(int id)
        {
            try
            {
                var post = await _context.Posts.FindAsync(id);
                if (post == null)
                    return false;

                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in DeletePost: {e.Message}");
                return false;
            }
        }
    }
}