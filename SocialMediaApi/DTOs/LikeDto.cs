namespace SocialMediaApi.Models
{
    public class LikeDto
    {
        public int Id { get; set; }
        public UserDto User { get; set; } = null!;
    }
}