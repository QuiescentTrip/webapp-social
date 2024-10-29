namespace SocialMediaApi.Models
{
    public class PostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime Created { get; set; }
        public UserDto User { get; set; } = null!;
        public int LikesCount { get; set; }
        public ICollection<LikeDto> Likes { get; set; } = new List<LikeDto>();
        public ICollection<CommentDto> Comments { get; set; } = new List<CommentDto>();
    }
}