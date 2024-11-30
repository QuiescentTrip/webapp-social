namespace SocialMediaApi.Models
{
    public class ProfileUpdateDto
    {
        public string? Username { get; set; }
        public string? Name { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
        public IFormFile? ProfilePicture { get; set; }
    }
}