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

        public async Task<IEnumerable<CommentDto>> GetAllComments()
        {
            try
            {
                var comments = await _context.Comments
                    .Include(c => c.User)
                    .Include(c => c.Post)
                    .ToListAsync();

                return comments.Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    Created = c.Created,
                    User = new UserDto
                    {
                        Email = c.User.Email ?? "",
                        Username = c.User.UserName ?? "",
                        Name = c.User.Name,
                        ProfilePictureUrl = c.User.ProfilePictureUrl
                    }
                });
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in GetAllComments: {e.Message}");
                return Enumerable.Empty<CommentDto>();
            }
        }

        public async Task<CommentDto?> GetCommentById(int id)
        {
            try
            {
                var comment = await _context.Comments
                    .Include(c => c.User)
                    .Include(c => c.Post)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (comment == null) return null;

                return new CommentDto
                {
                    Id = comment.Id,
                    Content = comment.Content,
                    Created = comment.Created,
                    User = new UserDto
                    {
                        Email = comment.User.Email ?? "",
                        Username = comment.User.UserName ?? "",
                        Name = comment.User.Name,
                        ProfilePictureUrl = comment.User.ProfilePictureUrl
                    }
                };
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

        public async Task<bool> IsCommentOwner(int commentId, string userId)
        {
            try
            {
                var comment = await _context.Comments
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.Id == commentId);

                if (comment == null)
                {
                    return false;
                }

                return comment.User.Id == userId;
            }
            catch (Exception e)
            {
                _logger.LogError($"Error in IsCommentOwner: {e.Message}");
                return false;
            }
        }
    }
}