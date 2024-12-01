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
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            context.Database.Migrate();

            SeedRoles(roleManager).Wait();
            SeedUsers(userManager).Wait();
            SeedPosts(context, userManager).Wait();
        }
    }

    private static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
    {
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }
    }

    private static async Task SeedUsers(UserManager<ApplicationUser> userManager)
    {

        var adminEmail = "admin@admin.com";

        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = "admin",
                Email = adminEmail,
                Name = "admin",
                ProfilePictureUrl = "/uploads/profiles/admin.jpg"
            };
            await userManager.CreateAsync(adminUser, "admin");
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }

        string[] userEmails = { "john@example.com", "patrick@patrick.com", "bob@example.com" };

        foreach (var email in userEmails)
        {
            if (await userManager.FindByEmailAsync(email) == null)
            {
                var pfp = "";
                // to display user without profile picture
                if (email != "bob@example.com")
                {
                    pfp = "/uploads/profiles/" + email.Split('@')[0] + ".jpg";
                }
                var user = new ApplicationUser
                {
                    UserName = email.Split('@')[0],
                    Email = email,
                    Name = email.Split('@')[0],
                    ProfilePictureUrl = pfp
                };
                await userManager.CreateAsync(user, "patrick");
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
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)],
                },
                new Post
                {
                    Title = "Beautiful Sunset",
                    ImageUrl = "/uploads/sunset.webp",
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)],
                },
                new Post
                {
                    Title = "My Pet Cat",
                    ImageUrl = "/uploads/cat.webp",
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)],
                },
                new Post
                {
                    Title = "Morning Coffee",
                    ImageUrl = "/uploads/coffee.jpg",
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)],
                },
                new Post
                {
                    Title = "City Lights",
                    ImageUrl = "/uploads/cityskape.jpeg",
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)],
                },
                new Post
                {
                    Title = "Weekend Hiking",
                    ImageUrl = "/uploads/hiking.jpg",
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)],
                },
                new Post
                {
                    Title = "My Garden Project",
                    ImageUrl = "/uploads/garden.jpg",
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)],
                },
                new Post
                {
                    Title = "Beach Sunset",
                    ImageUrl = "/uploads/beach.jpg",
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)],
                }
            };

            context.Posts.AddRange(posts);
            await context.SaveChangesAsync();

            // Add comments to the posts
            posts[0].Comments = new List<Comment>
            {
                new Comment { Post = posts[0], Content = "Welcome to the community!", User = users[1], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[0], Content = "Great first post!", User = users[2], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
            };

            posts[1].Comments = new List<Comment>
            {
                new Comment { Post = posts[1], Content = "Stunning view!", User = users[0], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[1], Content = "Where was this taken?", User = users[1], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[1], Content = "I wish I was there!", User = users[2], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[1], Content = "The lighting is perfect!", User = users[3], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[1], Content = "This is amazing!", User = users[0], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) }
            };

            posts[3].Comments = new List<Comment>
            {
                new Comment { Post = posts[3], Content = "Great coffee!", User = users[0], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[3], Content = "I love the view!", User = users[1], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[3], Content = "Perfect morning vibes!", User = users[2], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[3], Content = "Which coffee shop is this?", User = users[3], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) }
            };

            posts[5].Comments = new List<Comment>
            {
                new Comment { Post = posts[5], Content = "I love gardening!", User = users[0], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[5], Content = "Your garden project looks amazing!", User = users[1], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[5], Content = "What plants are you growing?", User = users[2], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[5], Content = "This is inspiring!", User = users[3], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[5], Content = "Can't wait to see more updates!", User = users[0], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) }
            };

            posts[6].Comments = new List<Comment>
            {
                new Comment { Post = posts[6], Content = "I'm in love with the beach!", User = users[1], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
            };

            await context.SaveChangesAsync();
        }
    }
}
