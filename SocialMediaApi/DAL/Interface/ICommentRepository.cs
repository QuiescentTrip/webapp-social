using SocialMediaApi.Models;

namespace SocialMediaApi.DAL
{
    public interface ICommentRepository
    {
        Task<IEnumerable<CommentDto>> GetAllComments();
        Task<CommentDto?> GetCommentById(int id);
        Task<Comment?> CreateComment(Comment comment);
        Task<bool> UpdateComment(Comment comment);
        Task<bool> DeleteComment(int id);
        Task<bool> CommentExists(int id);
        Task<bool> IsCommentOwner(int commentId, string username);
    }
}