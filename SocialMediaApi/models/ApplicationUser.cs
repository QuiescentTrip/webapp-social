using Microsoft.AspNetCore.Identity;

namespace SocialMediaApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? Name { get; set; }  // Make it nullable
    }
}