using System;

namespace SocialMediaApi.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public required string Content { get; set; }
        public int PostId { get; set; }
        public required Post Post { get; set; }
        public DateTime Created { get; set; }
        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}