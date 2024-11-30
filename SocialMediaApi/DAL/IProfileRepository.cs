using Microsoft.AspNetCore.Identity;
using SocialMediaApi.Models;

namespace SocialMediaApi.Repositories
{
    public interface IProfileRepository
    {
        Task<bool> UpdateUsername(ApplicationUser user, string newUsername);
        Task<bool> UpdatePassword(ApplicationUser user, string currentPassword, string newPassword);
        Task<string> UpdateProfilePicture(ApplicationUser user, IFormFile picture);
        Task<bool> DeleteOldProfilePicture(string oldPicturePath);
    }
}