using System;
using System.Collections.Generic;

namespace SocialMediaApi.Models
{
    public class Post
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string ImageUrl { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public int LikesCount { get; set; } = 0;
        public required ApplicationUser User { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Like> Likes { get; set; } = new List<Like>();
    }
}