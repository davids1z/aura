using Microsoft.EntityFrameworkCore;
using development.Data;
using development.Models;
using development.Models.Requests;

namespace development.Endpoints;

public static class ScheduleEndpoints
{
    public static void MapScheduleEndpoints(this WebApplication app)
    {
        // Get weekly schedule (public)
        app.MapGet("/api/schedule", async (AuraDbContext db) =>
        {
            var schedule = await db.DaySchedules
                .Include(d => d.TimeSlots.Where(t => t.IsEnabled))
                .OrderBy(d => d.DayOfWeek)
                .Select(d => new
                {
                    d.Id,
                    DayOfWeek = d.DayOfWeek.ToString(),
                    d.IsOpen,
                    d.OpenTime,
                    d.CloseTime,
                    TimeSlots = d.TimeSlots.Select(t => new { t.Time, t.MaxReservations })
                })
                .ToListAsync();

            return Results.Ok(schedule);
        });

        // Get available slots for a specific date (public)
        app.MapGet("/api/schedule/available/{date}", async (DateTime date, AuraDbContext db) =>
        {
            // Check for date override first
            var dateOnly = date.Date;
            var utcDate = DateTime.SpecifyKind(dateOnly, DateTimeKind.Utc);

            var dateOverride = await db.DateOverrides.FirstOrDefaultAsync(d => d.Date.Date == utcDate.Date);
            if (dateOverride?.IsClosed == true)
            {
                return Results.Ok(new { IsClosed = true, Reason = dateOverride.Reason, Slots = Array.Empty<object>(), AllSlots = Array.Empty<object>() });
            }

            // Get day schedule
            var dayOfWeek = (DayOfWeekEnum)((int)date.DayOfWeek == 0 ? 6 : (int)date.DayOfWeek - 1); // Convert to our enum
            var daySchedule = await db.DaySchedules
                .Include(d => d.TimeSlots)
                .FirstOrDefaultAsync(d => d.DayOfWeek == dayOfWeek);

            if (daySchedule == null || !daySchedule.IsOpen)
            {
                return Results.Ok(new { IsClosed = true, Reason = "Zatvoreno", Slots = Array.Empty<object>(), AllSlots = Array.Empty<object>() });
            }

            // Get existing reservations for that date (using date range for reliable comparison)
            var startOfDay = utcDate.Date;
            var endOfDay = startOfDay.AddDays(1);
            var existingReservations = await db.Reservations
                .Where(r => r.Date >= startOfDay && r.Date < endOfDay && r.Status != ReservationStatus.Cancelled)
                .GroupBy(r => r.Time)
                .Select(g => new { Time = g.Key, Count = g.Count() })
                .ToListAsync();

            // Provjeri je li danas - ako da, filtriraj prošle termine
            var now = DateTime.Now;
            var todayLocal = DateTime.Today;
            var isToday = dateOnly == todayLocal;
            var currentHour = now.Hour;

            // Odredi radno vrijeme za taj dan (uzmi override ako postoji)
            var effectiveOpenTime = dateOverride?.OpenTime ?? daySchedule.OpenTime ?? "12:00";
            var effectiveCloseTime = dateOverride?.CloseTime ?? daySchedule.CloseTime ?? "23:00";

            // Parsiraj sate za filtriranje
            int.TryParse(effectiveOpenTime.Split(':')[0], out int openHour);
            int.TryParse(effectiveCloseTime.Split(':')[0], out int closeHour);

            // Return ALL slots (including full ones) so frontend can show them as crossed out
            // Ali filtriraj prema radnom vremenu i ako je danas, filtriraj prošle termine
            var allSlots = daySchedule.TimeSlots
                .Where(t => t.IsEnabled)
                .Where(t => {
                    // Parsiraj sat iz vremena (npr. "14:00" -> 14)
                    if (!int.TryParse(t.Time.Split(':')[0], out int slotHour)) return true;

                    // Filtriraj slotove izvan radnog vremena
                    if (slotHour < openHour || slotHour >= closeHour) return false;

                    // Ako je danas, filtriraj prošle termine
                    if (isToday && slotHour <= currentHour) return false;

                    return true;
                })
                .OrderBy(t => t.Time)
                .Select(t =>
                {
                    var reserved = existingReservations.FirstOrDefault(r => r.Time == t.Time)?.Count ?? 0;
                    return new
                    {
                        t.Time,
                        Available = t.MaxReservations - reserved,
                        t.MaxReservations
                    };
                })
                .ToList();

            // Also return only available slots for backward compatibility
            var availableSlots = allSlots.Where(s => s.Available > 0).ToList();

            return Results.Ok(new
            {
                IsClosed = false,
                OpenTime = effectiveOpenTime,
                CloseTime = effectiveCloseTime,
                Slots = availableSlots,
                AllSlots = allSlots
            });
        });

        // Get calendar availability for a date range (public)
        // Returns status for each day: "available", "limited", "full", "closed"
        app.MapGet("/api/schedule/calendar/{startDate}/{endDate}", async (DateTime startDate, DateTime endDate, AuraDbContext db) =>
        {
            var result = new List<object>();
            var start = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var end = DateTime.SpecifyKind(endDate.Date, DateTimeKind.Utc);

            // Get all day schedules with time slots
            var daySchedules = await db.DaySchedules
                .Include(d => d.TimeSlots)
                .ToListAsync();

            // Get all date overrides in range
            var dateOverrides = await db.DateOverrides
                .Where(d => d.Date >= start && d.Date <= end)
                .ToListAsync();

            // Get all reservations in range (excluding cancelled)
            var reservations = await db.Reservations
                .Where(r => r.Date >= start && r.Date <= end && r.Status != ReservationStatus.Cancelled)
                .ToListAsync();

            for (var date = start; date <= end; date = date.AddDays(1))
            {
                // Check for date override first
                var dateOverride = dateOverrides.FirstOrDefault(d => d.Date.Date == date.Date);
                if (dateOverride?.IsClosed == true)
                {
                    result.Add(new { Date = date.ToString("yyyy-MM-dd"), Status = "closed", AvailableSlots = 0, TotalSlots = 0 });
                    continue;
                }

                // Get day schedule
                var dayOfWeek = (DayOfWeekEnum)((int)date.DayOfWeek == 0 ? 6 : (int)date.DayOfWeek - 1);
                var daySchedule = daySchedules.FirstOrDefault(d => d.DayOfWeek == dayOfWeek);

                if (daySchedule == null || !daySchedule.IsOpen)
                {
                    result.Add(new { Date = date.ToString("yyyy-MM-dd"), Status = "closed", AvailableSlots = 0, TotalSlots = 0 });
                    continue;
                }

                // Odredi radno vrijeme (koristi override ako postoji skraćeno radno vrijeme)
                var effectiveOpenTime = dateOverride?.OpenTime ?? daySchedule.OpenTime ?? "12:00";
                var effectiveCloseTime = dateOverride?.CloseTime ?? daySchedule.CloseTime ?? "23:00";
                int.TryParse(effectiveOpenTime.Split(':')[0], out int openHour);
                int.TryParse(effectiveCloseTime.Split(':')[0], out int closeHour);

                // Count reservations for this date
                var dayReservations = reservations.Where(r => r.Date.Date == date.Date).ToList();

                // Filtriraj slotove prema radnom vremenu
                var validSlots = daySchedule.TimeSlots
                    .Where(t => t.IsEnabled)
                    .Where(t => {
                        if (!int.TryParse(t.Time.Split(':')[0], out int slotHour)) return true;
                        return slotHour >= openHour && slotHour < closeHour;
                    })
                    .ToList();

                var totalSlots = validSlots.Count;

                // Count available slots
                var availableSlots = 0;
                foreach (var slot in validSlots)
                {
                    var slotReservations = dayReservations.Count(r => r.Time == slot.Time);
                    if (slotReservations < slot.MaxReservations)
                    {
                        availableSlots++;
                    }
                }

                // Determine status
                // "limited" = više od pola termina zauzeto (manje od pola slobodno)
                string status;
                var takenSlots = totalSlots - availableSlots;
                if (availableSlots == 0)
                    status = "full";
                else if (takenSlots > totalSlots / 2)  // Više od pola zauzeto = žuto
                    status = "limited";
                else
                    status = "available";

                result.Add(new { Date = date.ToString("yyyy-MM-dd"), Status = status, AvailableSlots = availableSlots, TotalSlots = totalSlots });
            }

            return Results.Ok(result);
        });

        // Update day schedule (admin)
        app.MapPut("/api/admin/schedule/{dayOfWeek}", async (DayOfWeekEnum dayOfWeek, DayScheduleRequest request, HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);
            if (admin == null) return Results.Unauthorized();

            var schedule = await db.DaySchedules.FirstOrDefaultAsync(d => d.DayOfWeek == dayOfWeek);
            if (schedule == null)
            {
                schedule = new DaySchedule { DayOfWeek = dayOfWeek };
                db.DaySchedules.Add(schedule);
            }

            schedule.IsOpen = request.IsOpen;
            schedule.OpenTime = request.OpenTime;
            schedule.CloseTime = request.CloseTime;
            schedule.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return Results.Ok(schedule);
        });

        // Add/Update time slot (admin)
        app.MapPost("/api/admin/schedule/{dayOfWeek}/slots", async (DayOfWeekEnum dayOfWeek, TimeSlotRequest request, HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);
            if (admin == null) return Results.Unauthorized();

            var schedule = await db.DaySchedules.FirstOrDefaultAsync(d => d.DayOfWeek == dayOfWeek);
            if (schedule == null) return Results.NotFound("Dan nije pronađen");

            var existingSlot = await db.TimeSlots.FirstOrDefaultAsync(t => t.DayScheduleId == schedule.Id && t.Time == request.Time);
            if (existingSlot != null)
            {
                existingSlot.MaxReservations = request.MaxReservations;
                existingSlot.IsEnabled = request.IsEnabled;
            }
            else
            {
                var slot = new TimeSlot
                {
                    DayScheduleId = schedule.Id,
                    Time = request.Time,
                    MaxReservations = request.MaxReservations,
                    IsEnabled = request.IsEnabled
                };
                db.TimeSlots.Add(slot);
            }

            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // Delete time slot (admin)
        app.MapDelete("/api/admin/schedule/slots/{id}", async (int id, HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);
            if (admin == null) return Results.Unauthorized();

            var slot = await db.TimeSlots.FindAsync(id);
            if (slot == null) return Results.NotFound();

            db.TimeSlots.Remove(slot);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }
}
