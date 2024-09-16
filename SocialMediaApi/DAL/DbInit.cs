using Microsoft.EntityFrameworkCore;
using SocialMediaApi.Models;
using SocialMediaApi.DAL;
using Microsoft.Data.Sqlite;

public static class DBInit
{
    public static void Seed(WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            // Use services to get required dependencies and perform seeding
        }
    }
}