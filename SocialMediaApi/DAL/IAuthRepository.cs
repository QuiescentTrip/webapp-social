using Microsoft.AspNetCore.Identity;
using SocialMediaApi.Models;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SocialMediaApi.Repositories
{
    public interface IAuthRepository
    {
        Task<ApplicationUser?> FindUserByEmailAsync(string email);
        Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password);
        Task SignInAsync(ApplicationUser user, bool isPersistent);
        Task<SignInResult> PasswordSignInAsync(string userName, string password, bool isPersistent, bool lockoutOnFailure);
        Task SignOutAsync();
        Task<ApplicationUser?> GetUserAsync(ClaimsPrincipal user);
        Task<IList<string>> GetUserRolesAsync(ApplicationUser user);
    }
}