using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SocialMediaApi.Models;
using System.Threading.Tasks;
using System;
using SocialMediaApi.Repositories;

namespace SocialMediaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;

        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            // Check if email is already in use
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
                return Ok(new { username = user.UserName, email = user.Email });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(new ValidationProblemDetails(ModelState));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            var user = await _authRepository.FindUserByEmailAsync(model.Email);
            if (user == null)
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
                return NotFound("User not found");
            }

            return Ok(new { username = user.UserName, email = user.Email });
        }
    }
}