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
                return await _context.Posts
                    .Include(p => p.Comments)
                        .ThenInclude(c => c.User)
                    .Include(p => p.User)
                    .Include(p => p.Likes)
                        .ThenInclude(l => l.User)
                    .ToListAsync();
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
                return await _context.Posts
                    .Include(p => p.Comments)
                    .Include(p => p.User)
                    .FirstOrDefaultAsync(p => p.Id == id);
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
                _logger.LogError($"Error in CreatePost: {e.Message}");
                _logger.LogError($"Inner exception: {e.InnerException?.Message}");
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
        public async Task<bool> LikePost(int postId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var post = await _context.Posts.FindAsync(postId);
                if (post == null)
                    return false;

                post.LikesCount++;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception e)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error in LikePost: {e.Message}");
                return false;
            }
        }
        //todo: same thing here
        public async Task<bool> UnlikePost(int postId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var post = await _context.Posts.FindAsync(postId);
                if (post == null)
                    return false;

                post.LikesCount--;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception e)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error in LikePost: {e.Message}");
                return false;
            }
        }
    }
}