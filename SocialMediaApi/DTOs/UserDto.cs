using System.ComponentModel.DataAnnotations;

namespace SocialMediaApi.Models
{
    public class UserDto
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Name { get; set; }
    }
}