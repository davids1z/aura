using Microsoft.EntityFrameworkCore;
using development.Data;
using development.Models;
using development.Models.Requests;

namespace development.Endpoints;

public static class ReservationEndpoints
{
    public static void MapReservationEndpoints(this WebApplication app)
    {
        app.MapGet("/api/reservations", async (HttpContext context, AuraDbContext db) =>
        {
            // Verify admin token
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (admin == null)
            {
                return Results.Unauthorized();
            }

            var reservations = await db.Reservations
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.UserId,
                    r.Date,
                    r.Time,
                    r.Guests,
                    r.TableNumber,
                    Status = r.Status.ToString(),
                    r.SpecialRequests,
                    r.AdminNotes,
                    r.CreatedAt,
                    r.UpdatedAt,
                    User = new
                    {
                        r.User.Name,
                        r.User.Email,
                        r.User.Phone
                    }
                })
                .ToListAsync();

            return Results.Ok(reservations);
        });

        app.MapPost("/api/reservations", async (HttpContext context, ReservationRequest request, AuraDbContext db) =>
        {
            // Verify user token
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var user = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && !u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (user == null)
            {
                return Results.Unauthorized();
            }

            var reservation = new Reservation
            {
                UserId = user.Id,
                Date = request.Date.Kind == DateTimeKind.Unspecified
                    ? DateTime.SpecifyKind(request.Date, DateTimeKind.Utc)
                    : request.Date,
                Time = request.Time,
                Guests = request.Guests,
                TableNumber = 0,
                Status = ReservationStatus.Pending,
                SpecialRequests = request.SpecialRequests ?? "",
                AdminNotes = "",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.Reservations.Add(reservation);
            await db.SaveChangesAsync();

            // Log activity
            db.ActivityLogs.Add(new ActivityLog
            {
                Type = ActivityType.ReservationCreated,
                UserId = user.Id,
                UserName = user.Name,
                UserEmail = user.Email,
                Description = $"Nova rezervacija: {reservation.Date:dd.MM.yyyy} u {reservation.Time} za {reservation.Guests} osoba",
                RelatedId = reservation.Id,
                CreatedAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();

            // Return only necessary data (no sensitive user info)
            return Results.Created($"/api/reservations/{reservation.Id}", new {
                reservation.Id,
                reservation.Date,
                reservation.Time,
                reservation.Guests,
                Status = reservation.Status.ToString(),
                reservation.SpecialRequests,
                reservation.CreatedAt
            });
        });

        // Update reservation (admin only) - change status, table, notes
        app.MapPut("/api/reservations/{id}", async (int id, UpdateReservationRequest request, HttpContext context, AuraDbContext db) =>
        {
            // Verify admin token
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (admin == null)
            {
                return Results.Unauthorized();
            }

            var reservation = await db.Reservations.Include(r => r.User).FirstOrDefaultAsync(r => r.Id == id);
            if (reservation == null) return Results.NotFound();

            var oldStatus = reservation.Status;

            if (request.Status.HasValue)
                reservation.Status = request.Status.Value;
            if (request.TableNumber.HasValue)
                reservation.TableNumber = request.TableNumber.Value;
            if (request.AdminNotes != null)
                reservation.AdminNotes = request.AdminNotes;

            reservation.UpdatedAt = DateTime.UtcNow;

            // Log activity
            var activityType = request.Status == ReservationStatus.Cancelled
                ? ActivityType.ReservationCancelled
                : ActivityType.ReservationUpdated;

            db.ActivityLogs.Add(new ActivityLog
            {
                Type = activityType,
                UserId = reservation.UserId,
                UserName = reservation.User?.Name ?? "",
                UserEmail = reservation.User?.Email ?? "",
                Description = activityType == ActivityType.ReservationCancelled
                    ? $"Rezervacija otkazana: {reservation.Date:dd.MM.yyyy} u {reservation.Time}"
                    : $"Rezervacija ažurirana: {oldStatus} -> {reservation.Status}",
                RelatedId = reservation.Id,
                CreatedAt = DateTime.UtcNow
            });

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                reservation.Id,
                Status = reservation.Status.ToString(),
                reservation.TableNumber,
                reservation.AdminNotes,
                reservation.UpdatedAt
            });
        });

        app.MapDelete("/api/reservations/{id}", async (int id, HttpContext context, AuraDbContext db) =>
        {
            // Verify admin token
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (admin == null)
            {
                return Results.Unauthorized();
            }

            var reservation = await db.Reservations.FindAsync(id);
            if (reservation == null) return Results.NotFound();

            db.Reservations.Remove(reservation);
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // Get user's own reservations
        app.MapGet("/api/my-reservations", async (HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var user = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && !u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (user == null)
            {
                return Results.Unauthorized();
            }

            var reservations = await db.Reservations
                .Where(r => r.UserId == user.Id)
                .OrderByDescending(r => r.Date)
                .Select(r => new
                {
                    r.Id,
                    r.Date,
                    r.Time,
                    r.Guests,
                    r.TableNumber,
                    Status = r.Status.ToString(),
                    r.SpecialRequests,
                    r.CreatedAt
                })
                .ToListAsync();

            return Results.Ok(reservations);
        });
    }
}
