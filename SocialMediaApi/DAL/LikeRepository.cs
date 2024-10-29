using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SocialMediaApi.Models;

namespace SocialMediaApi.DAL
{
    public class LikeRepository : ILikeRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<LikeRepository> _logger;

        public LikeRepository(ApplicationDbContext context, ILogger<LikeRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Like?> GetLike(int postId, string userId)
        {
            try
            {
                return await _context.Likes
                    .Include(l => l.Post)
                    .Include(l => l.User)
                    .FirstOrDefaultAsync(l => l.Post.Id == postId && l.User.Id == userId);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in GetLike: {e.Message}");
                return null;
            }
        }

        public async Task<bool> AddLike(int postId, string userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var post = await _context.Posts.FindAsync(postId);
                var user = await _context.Users.FindAsync(userId);

                if (post == null || user == null)
                    return false;

                var existingLike = await GetLike(postId, userId);
                if (existingLike != null)
                    return false;

                var like = new Like
                {
                    Post = post,
                    User = user
                };

                _context.Likes.Add(like);
                post.LikesCount++;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception e)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error in AddLike: {e.Message}");
                return false;
            }
        }

        public async Task<bool> RemoveLike(int postId, string userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var like = await GetLike(postId, userId);
                if (like == null)
                    return false;

                var post = await _context.Posts.FindAsync(postId);
                if (post == null)
                    return false;

                _context.Likes.Remove(like);
                post.LikesCount--;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception e)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error in RemoveLike: {e.Message}");
                return false;
            }
        }

        public async Task<IEnumerable<Like>> GetLikesByPost(int postId)
        {
            try
            {
                return await _context.Likes
                    .Include(l => l.User)
                    .Where(l => l.Post.Id == postId)
                    .ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in GetLikesByPost: {e.Message}");
                return Enumerable.Empty<Like>();
            }
        }

        public async Task<IEnumerable<Like>> GetLikesByUser(string userId)
        {
            try
            {
                return await _context.Likes
                    .Include(l => l.Post)
                    .Where(l => l.User.Id == userId)
                    .ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in GetLikesByUser: {e.Message}");
                return Enumerable.Empty<Like>();
            }
        }

        public async Task<bool> HasUserLikedPost(int postId, string userId)
        {
            try
            {
                return await _context.Likes
                    .AnyAsync(l => l.Post.Id == postId && l.User.Id == userId);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in HasUserLikedPost: {e.Message}");
                return false;
            }
        }
    }
}