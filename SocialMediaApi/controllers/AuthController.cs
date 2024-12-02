using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SocialMediaApi.Models;

using System.Threading.Tasks;
using System;
using SocialMediaApi.Repositories;
using Microsoft.Extensions.Logging;

namespace SocialMediaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthRepository authRepository, ILogger<AuthController> logger)
        {
            _authRepository = authRepository;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ValidationProblemDetails(ModelState));
                }

                var existingUser = await _authRepository.FindUserByEmailAsync(model.Email);
                if (existingUser != null)
                {
                    ModelState.AddModelError("Email", "Email is already in use");
                    return BadRequest(new ValidationProblemDetails(ModelState));
                }

                var user = new ApplicationUser
                {
                    UserName = model.Username,
                    Email = model.Email,
                    Name = model.Name
                };

                var result = await _authRepository.CreateUserAsync(user, model.Password);

                if (result.Succeeded)
                {
                    await _authRepository.SignInAsync(user, isPersistent: false);
                    return Ok(new UserDto
                    {
                        Username = user.UserName,
                        Email = user.Email,
                        Name = user.Name,
                        ProfilePictureUrl = user.ProfilePictureUrl ?? string.Empty
                    });
                }

                _logger.LogError("Failed to register user {Email}. Errors: {Errors}",
                    model.Email,
                    string.Join(", ", result.Errors.Select(e => e.Description)));

                return BadRequest(new ValidationProblemDetails(ModelState));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during user registration for {Email}", model.Email);
                return StatusCode(500, "An unexpected error occurred during registration");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ValidationProblemDetails(ModelState));
                }

                var user = await _authRepository.FindUserByEmailAsync(model.Email);
                if (user == null || user.UserName == null)
                {
                    ModelState.AddModelError("Email", "Invalid email or password");
                    return BadRequest(new ValidationProblemDetails(ModelState));
                }

                var result = await _authRepository.PasswordSignInAsync(user.UserName, model.Password, isPersistent: false, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    return Ok(new { username = user.UserName, email = user.Email });
                }

                ModelState.AddModelError("Password", "Invalid email or password");
                return BadRequest(new ValidationProblemDetails(ModelState));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during login attempt for {Email}", model.Email);
                return StatusCode(500, "An unexpected error occurred during login");
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _authRepository.SignOutAsync();
            return Ok(new { message = "User logged out successfully" });
        }
        // Authorize checks the token given in the header by identity and gets the user info from userManager
        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> GetUserInfo()
        {
            var user = await _authRepository.GetUserAsync(User);
            if (user == null)
            {
                return NoContent();
            }

            var roles = await _authRepository.GetUserRolesAsync(user);

            return Ok(new
            {
                username = user.UserName,
                email = user.Email,
                name = user.Name,
                roles = roles,
                profilePictureUrl = user.ProfilePictureUrl
            });
        }
    }
}