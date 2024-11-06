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
		if(!await roleManager.RoleExistsAsync("Admin"))
		{
			await roleManager.CreateAsync(new IdentityRole("Admin"));
		}
	}

    private static async Task SeedUsers(UserManager<ApplicationUser> userManager)
    {
		
		var adminEmail = "admin@admin.com";
		
		if(await userManager.FindByEmailAsync(adminEmail) == null)
		{
			var adminUser = new ApplicationUser
			{
				UserName = "admin",
				Email = adminEmail,
				Name = "Admin"
			};
			await userManager.CreateAsync(adminUser, "AdminPassword123!");
			await userManager.AddToRoleAsync(adminUser, "Admin");
		}

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
                    User = users[random.Next(users.Count)],
                },
                new Post
                {
                    Title = "Beautiful Sunset",
                    ImageUrl = "/uploads/sunset.webp",
                    LikesCount = random.Next(0, 100),
                    Created = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    User = users[random.Next(users.Count)],
                },
                new Post
                {
                    Title = "My Pet Cat",
                    ImageUrl = "/uploads/cat.webp",
                    LikesCount = random.Next(0, 100),
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
                new Comment { Post = posts[0], Content = "Great first post!", User = users[2], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) }
            };

            posts[1].Comments = new List<Comment>
            {
                new Comment { Post = posts[1], Content = "Stunning view!", User = users[0], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[1], Content = "Where was this taken?", User = users[1], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[1], Content = "I wish I was there!", User = users[2], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) }
            };

            posts[2].Comments = new List<Comment>
            {
                new Comment { Post = posts[2], Content = "So cute!", User = users[1], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) },
                new Comment { Post = posts[2], Content = "What's its name?", User = users[2], Created = DateTime.UtcNow.AddDays(-random.Next(1, 5)) }
            };

            await context.SaveChangesAsync();
        }
    }
}
