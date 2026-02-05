using Microsoft.EntityFrameworkCore;
using development.Data;
using development.Models;

namespace development.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        app.MapGet("/api/users", async (HttpContext context, AuraDbContext db) =>
        {
            // Verify admin token
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (admin == null)
            {
                return Results.Unauthorized();
            }

            var users = await db.Users
                .Where(u => !u.IsAdmin)
                .Include(u => u.Reservations)
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Phone,
                    u.CreatedAt,
                    u.LastLoginAt,
                    u.LoginCount,
                    ReservationCount = u.Reservations.Count,
                    IsOnline = u.SessionToken != "" && u.TokenExpiry > DateTime.UtcNow
                })
                .ToListAsync();

            return Results.Ok(users);
        });

        // Get activity logs (admin only)
        app.MapGet("/api/admin/activity-logs", async (HttpContext context, AuraDbContext db, int? limit, int? offset, string? type) =>
        {
            // Verify admin token
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (admin == null)
            {
                return Results.Unauthorized();
            }

            var query = db.ActivityLogs.AsQueryable();

            // Filter by type if provided
            if (!string.IsNullOrEmpty(type) && Enum.TryParse<ActivityType>(type, out var activityType))
            {
                query = query.Where(a => a.Type == activityType);
            }

            var total = await query.CountAsync();

            var logs = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip(offset ?? 0)
                .Take(limit ?? 50)
                .Select(a => new {
                    a.Id,
                    Type = a.Type.ToString(),
                    a.UserId,
                    a.UserName,
                    a.UserEmail,
                    a.Description,
                    a.RelatedId,
                    a.CreatedAt
                })
                .ToListAsync();

            return Results.Ok(new { total, logs });
        });
    }
}
