using Microsoft.EntityFrameworkCore;
using development.Data;
using development.Models;
using development.Models.Requests;

namespace development.Endpoints;

public static class DateOverrideEndpoints
{
    public static void MapDateOverrideEndpoints(this WebApplication app)
    {
        // Get all date overrides (admin)
        app.MapGet("/api/admin/date-overrides", async (HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);
            if (admin == null) return Results.Unauthorized();

            var overrides = await db.DateOverrides
                .OrderBy(d => d.Date)
                .ToListAsync();

            return Results.Ok(overrides);
        });

        // Create date override (admin)
        app.MapPost("/api/admin/date-overrides", async (DateOverrideRequest request, HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);
            if (admin == null) return Results.Unauthorized();

            var dateOverride = new DateOverride
            {
                Date = DateTime.SpecifyKind(request.Date.Date, DateTimeKind.Utc),
                IsClosed = request.IsClosed,
                OpenTime = request.OpenTime,
                CloseTime = request.CloseTime,
                Reason = request.Reason,
                CreatedAt = DateTime.UtcNow
            };

            db.DateOverrides.Add(dateOverride);
            await db.SaveChangesAsync();
            return Results.Created($"/api/admin/date-overrides/{dateOverride.Id}", dateOverride);
        });

        // Delete date override (admin)
        app.MapDelete("/api/admin/date-overrides/{id}", async (int id, HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);
            if (admin == null) return Results.Unauthorized();

            var dateOverride = await db.DateOverrides.FindAsync(id);
            if (dateOverride == null) return Results.NotFound();

            db.DateOverrides.Remove(dateOverride);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }
}
