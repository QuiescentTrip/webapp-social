using Microsoft.EntityFrameworkCore;
using SocialMediaApi.Models;
using SocialMediaApi.DAL;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

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

            SeedUsers(userManager).Wait();
            SeedPosts(context, userManager).Wait();
        }
    }

    private static async Task SeedUsers(UserManager<ApplicationUser> userManager)
    {
        string[] userEmails = { "john@example.com", "jane@example.com", "bob@example.com" };

        foreach (var email in userEmails)
        {
            if (await userManager.FindByEmailAsync(email) == null)
            {
                var user = new ApplicationUser
                {
                    UserName = email.Split('@')[0],
                    Email = email,
                    Name = email.Split('@')[0].ToUpperInvariant()
                };
                await userManager.CreateAsync(user, "Password123!");
            }
        }
    }

    private static async Task SeedPosts(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        if (!context.Posts.Any())
        {
            var users = await userManager.Users.ToListAsync();
            var random = new Random();

            var posts = new List<Post>
            {
                new Post
                {
                    Title = "My First Post",
                    ImageUrl = "/uploads/poost.webp",
                    LikesCount = random.Next(0, 100),
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)]
                },
                new Post
                {
                    Title = "Beautiful Sunset",
                    ImageUrl = "/uploads/sunset.webp",
                    LikesCount = random.Next(0, 100),
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)]
                },
                new Post
                {
                    Title = "My Pet Cat",
                    ImageUrl = "/uploads/cat.webp",
                    LikesCount = random.Next(0, 100),
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)]
                }
            };

            context.Posts.AddRange(posts);
            await context.SaveChangesAsync();
        }
    }
}