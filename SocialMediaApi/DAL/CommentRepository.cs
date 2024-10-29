using Microsoft.EntityFrameworkCore;
using SocialMediaApi.Models;

namespace SocialMediaApi.DAL
{
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CommentRepository> _logger;

        public CommentRepository(ApplicationDbContext context, ILogger<CommentRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Comment>> GetAllComments()
        {
            try
            {
                return await _context.Comments
                    .Include(c => c.User)
                    .Include(c => c.Post)
                    .ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in GetAllComments: {e.Message}");
                return Enumerable.Empty<Comment>();
            }
        }

        public async Task<Comment?> GetCommentById(int id)
        {
            try
            {
                return await _context.Comments
                    .Include(c => c.User)
                    .Include(c => c.Post)
                    .FirstOrDefaultAsync(c => c.Id == id);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in GetCommentById: {e.Message}");
                return null;
            }
        }

        public async Task<Comment?> CreateComment(Comment comment)
        {
            try
            {
                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();
                return comment;
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in CreateComment: {e.Message}");
                _logger.LogError($"Inner exception: {e.InnerException?.Message}");
                return null;
            }
        }

        public async Task<bool> UpdateComment(Comment comment)
        {
            try
            {
                _context.Entry(comment).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in UpdateComment: {e.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteComment(int id)
        {
            try
            {
                var comment = await _context.Comments.FindAsync(id);
                if (comment == null)
                    return false;

                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in DeleteComment: {e.Message}");
                return false;
            }
        }

        public async Task<bool> CommentExists(int id)
        {
            try
            {
                return await _context.Comments.AnyAsync(c => c.Id == id);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in CommentExists: {e.Message}");
                return false;
            }
        }
    }
}