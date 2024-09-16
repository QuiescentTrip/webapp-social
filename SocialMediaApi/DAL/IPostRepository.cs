using SocialMediaApi.Models;

namespace SocialMediaApi.DAL
{
    public interface IPostRepository
    {
        Task<IEnumerable<Post>> GetAllPosts();
        Task<Post?> GetPostById(int id);
        Task<bool> CreatePost(Post post);
        Task<bool> UpdatePost(Post post);
        Task<bool> DeletePost(int id);
    }
}