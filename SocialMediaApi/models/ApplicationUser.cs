using Microsoft.AspNetCore.Identity;

namespace SocialMediaApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public required string Name { get; set; }
        public string? ProfilePictureUrl { get; set; }
    }
}