using System;

namespace SocialMediaApi.Models
{
    public class Like
    {
        public int Id { get; set; }
        public required Post Post { get; set; }
        public required ApplicationUser User { get; set; }
    }
}