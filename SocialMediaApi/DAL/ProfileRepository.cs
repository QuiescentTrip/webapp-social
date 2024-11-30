using Microsoft.AspNetCore.Identity;
using SocialMediaApi.Models;
using SocialMediaApi.Repositories;

namespace SocialMediaApi.DAL
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _environment;

        public ProfileRepository(
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment environment)
        {
            _userManager = userManager;
            _environment = environment;
        }

        public async Task<bool> UpdateUsername(ApplicationUser user, string newUsername)
        {
            var result = await _userManager.SetUserNameAsync(user, newUsername);
            return result.Succeeded;
        }

        public async Task<bool> UpdatePassword(ApplicationUser user, string currentPassword, string newPassword)
        {
            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            return result.Succeeded;
        }

        public async Task<string> UpdateProfilePicture(ApplicationUser user, IFormFile picture)
        {
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "profiles");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(picture.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await picture.CopyToAsync(stream);
            }

            return $"/uploads/profiles/{fileName}";
        }

        public Task<bool> DeleteOldProfilePicture(string oldPicturePath)
        {
            if (string.IsNullOrEmpty(oldPicturePath)) return Task.FromResult(true);

            var fullPath = Path.Combine(_environment.WebRootPath, oldPicturePath.TrimStart('/'));
            if (System.IO.File.Exists(fullPath))
            {
                try
                {
                    System.IO.File.Delete(fullPath);
                    return Task.FromResult(true);
                }
                catch
                {
                    return Task.FromResult(false);
                }
            }
            return Task.FromResult(true);
        }
    }
}