using Microsoft.EntityFrameworkCore;
using SocialMediaApi.Models;
using SocialMediaApi.DAL;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Identity;

public static class DBInit
{
    public static void Seed(WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<ApplicationDbContext>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

            context.Database.Migrate();

            SeedExamplePost(context, userManager).Wait();
        }
    }

    private static async Task SeedExamplePost(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        if (!context.Posts.Any())
        {
            var user = await userManager.FindByEmailAsync("example@example.com");

            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = "example",
                    Email = "example@example.com"
                };
                await userManager.CreateAsync(user, "ExamplePassword123!");
            }

            var post = new Post
            {
                Title = "Example Post",
                ImageUrl = "https://picsum.photos/1000/1000",
                Likes = 0,
                Created = DateTime.UtcNow,
                User = user
            };

            context.Posts.Add(post);
            await context.SaveChangesAsync();
        }
    }
}