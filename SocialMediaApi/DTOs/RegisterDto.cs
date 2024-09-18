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
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$",
            ErrorMessage = "Passwords must have at least one lowercase, one uppercase, and one non alphanumeric character.")]
        public required string Password { get; set; }
    }
}