using System.ComponentModel.DataAnnotations;

namespace SocialMediaApi.Models
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Username { get; set; }

        [Required]
        [MinLength(6)]
        public required string Password { get; set; }
    }
}