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

            SeedData(context, userManager).Wait();
        }
    }

    private static async Task SeedData(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        if (!context.Users.Any())
        {
            var users = new List<ApplicationUser>
            {
                new ApplicationUser { UserName = "alice", Email = "alice@example.com", Name = "Alice Johnson" },
                new ApplicationUser { UserName = "bob", Email = "bob@example.com", Name = "Bob Smith" },
                new ApplicationUser { UserName = "charlie", Email = "charlie@example.com", Name = "Charlie Brown" }
            };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Password123!");
            }

            await context.SaveChangesAsync();
        }

        if (!context.Posts.Any())
        {
            var users = await context.Users.ToListAsync();
            var posts = new List<Post>
            {
                new Post
                {
                    Title = "Beautiful Sunset",
                    ImageUrl = "https://picsum.photos/id/1000/1000/1000",
                    Likes = 15,
                    Created = DateTime.UtcNow.AddDays(-5),
                    User = users[0]
                },
                new Post
                {
                    Title = "City Skyline",
                    ImageUrl = "https://picsum.photos/id/1001/1000/1000",
                    Likes = 8,
                    Created = DateTime.UtcNow.AddDays(-3),
                    User = users[1]
                },
                new Post
                {
                    Title = "Mountain View",
                    ImageUrl = "https://picsum.photos/id/1002/1000/1000",
                    Likes = 23,
                    Created = DateTime.UtcNow.AddDays(-1),
                    User = users[2]
                }
            };

            context.Posts.AddRange(posts);
            await context.SaveChangesAsync();
        }

        if (!context.Comments.Any())
        {
            var users = await context.Users.ToListAsync();
            var posts = await context.Posts.ToListAsync();

            var comments = new List<Comment>
            {
                new Comment
                {
                    Content = "Wow, what a beautiful view!",
                    Created = DateTime.UtcNow.AddHours(-12),
                    User = users[1],
                    Post = posts[0]
                },
                new Comment
                {
                    Content = "I love this city!",
                    Created = DateTime.UtcNow.AddHours(-6),
                    User = users[2],
                    Post = posts[1]
                },
                new Comment
                {
                    Content = "Breathtaking scenery!",
                    Created = DateTime.UtcNow.AddHours(-2),
                    User = users[0],
                    Post = posts[2]
                }
            };

            context.Comments.AddRange(comments);
            await context.SaveChangesAsync();
        }
    }
}