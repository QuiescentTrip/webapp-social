using SocialMediaApi.Models;

namespace SocialMediaApi.DAL
{
    public interface ILikeRepository
    {
        Task<Like?> GetLike(int postId, string userId);
        Task<bool> AddLike(int postId, string userId);
        Task<bool> RemoveLike(int postId, string userId);
        Task<IEnumerable<Like>> GetLikesByPost(int postId);
        Task<IEnumerable<Like>> GetLikesByUser(string userId);
        Task<bool> HasUserLikedPost(int postId, string userId);
    }
}