using System;
using System.Collections.Generic;

namespace SocialMediaApi.Models
{
    public class Post
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string ImageUrl { get; set; }
        public int Likes { get; set; }
        public DateTime Created { get; set; }
        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }
        public List<Comment> Comments { get; set; } = new List<Comment>();
    }
}