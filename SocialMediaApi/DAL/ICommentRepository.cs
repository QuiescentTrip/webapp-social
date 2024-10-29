using SocialMediaApi.Models;

namespace SocialMediaApi.DAL
{
    public interface ICommentRepository
    {
        Task<IEnumerable<Comment>> GetAllComments();
        Task<Comment?> GetCommentById(int id);
        Task<Comment?> CreateComment(Comment comment);
        Task<bool> UpdateComment(Comment comment);
        Task<bool> DeleteComment(int id);
        Task<bool> CommentExists(int id);
    }
}