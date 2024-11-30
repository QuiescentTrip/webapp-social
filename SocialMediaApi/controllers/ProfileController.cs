using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApi.Models;
using SocialMediaApi.Repositories;

namespace SocialMediaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IProfileRepository _profileRepository;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(
            UserManager<ApplicationUser> userManager,
            IProfileRepository profileRepository,
            ILogger<ProfileController> logger)
        {
            _userManager = userManager;
            _profileRepository = profileRepository;
            _logger = logger;
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromForm] ProfileUpdateDto model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            try
            {
                // Handle username update
                if (!string.IsNullOrEmpty(model.Username) && model.Username != user.UserName)
                {
                    var existingUser = await _userManager.FindByNameAsync(model.Username);
                    if (existingUser != null)
                    {
                        return BadRequest(new { message = "Username is already taken" });
                    }

                    var usernameUpdateResult = await _profileRepository.UpdateUsername(user, model.Username);
                    if (!usernameUpdateResult)
                    {
                        return BadRequest(new { message = "Failed to update username" });
                    }
                }

                // Handle name update
                if (!string.IsNullOrEmpty(model.Name) && model.Name != user.Name)
                {
                    user.Name = model.Name;
                }

                // Handle password change
                if (!string.IsNullOrEmpty(model.NewPassword))
                {
                    if (string.IsNullOrEmpty(model.CurrentPassword))
                    {
                        return BadRequest(new { message = "Current password is required" });
                    }

                    var passwordUpdateResult = await _profileRepository.UpdatePassword(user, model.CurrentPassword, model.NewPassword);
                    if (!passwordUpdateResult)
                    {
                        return BadRequest(new { message = "Failed to update password" });
                    }
                }

                // Handle profile picture upload
                if (model.ProfilePicture != null && model.ProfilePicture.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.ProfilePicture.FileName);
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");

                    // Ensure the profiles folder exists
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var filePath = Path.Combine(uploadsFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.ProfilePicture.CopyToAsync(stream);
                    }

                    user.ProfilePictureUrl = $"/uploads/profiles/{fileName}";
                    await _userManager.UpdateAsync(user);
                }

                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    return BadRequest(new { message = "Failed to update profile" });
                }

                // Return updated user info
                return Ok(new UserDto
                {
                    Username = user.UserName,
                    Email = user.Email,
                    Name = user.Name,
                    ProfilePictureUrl = user.ProfilePictureUrl ?? string.Empty
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile for user {UserId}", user.Id);
                return StatusCode(500, new { message = "An error occurred while updating the profile" });
            }
        }
    }
}