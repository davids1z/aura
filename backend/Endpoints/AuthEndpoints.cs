using Microsoft.EntityFrameworkCore;
using development.Data;
using development.Models;
using development.Models.Requests;
using development.Services;

namespace development.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        // Register new user
        app.MapPost("/api/auth/register", async (RegisterRequest request, AuraDbContext db) =>
        {
            Console.WriteLine($"🆕 REGISTER ENDPOINT HIT: {request.Email}");

            // Check if email already exists
            if (await db.Users.AnyAsync(u => u.Email == request.Email))
            {
                return Results.BadRequest(new { error = "Email je već registriran" });
            }

            var user = new User
            {
                Name = AuthService.FormatDisplayName(request.Name),
                Email = request.Email,
                Phone = request.Phone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                IsAdmin = false,
                CreatedAt = DateTime.UtcNow
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            // Generate session token
            var token = AuthService.GenerateToken();
            user.SessionToken = token;
            user.TokenExpiry = DateTime.UtcNow.AddDays(7);
            user.LastLoginAt = DateTime.UtcNow;
            user.LoginCount = 1;

            // Log activity
            db.ActivityLogs.Add(new ActivityLog
            {
                Type = ActivityType.UserRegistered,
                UserId = user.Id,
                UserName = user.Name,
                UserEmail = user.Email,
                Description = $"Novi korisnik registriran: {user.Name} ({user.Email})",
                CreatedAt = DateTime.UtcNow
            });

            await db.SaveChangesAsync();
            Console.WriteLine($"✅ User saved to database: {user.Email}");

            // Send welcome email (with proper error logging)
            Console.WriteLine($"📨 About to call EmailService for {user.Email}");
            try
            {
                Console.WriteLine($"🔔 Attempting to send welcome email to {user.Email}...");
                await EmailService.SendWelcomeEmailAsync(user.Email, user.Name);
                Console.WriteLine($"🔔 Welcome email task completed for {user.Email}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending welcome email: {ex.Message}");
                Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
            }

            return Results.Ok(new {
                token,
                user = new { user.Id, user.Name, user.Email, user.Phone }
            });
        });

        // Login user
        app.MapPost("/api/auth/login", async (LoginRequest request, AuraDbContext db) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email && !u.IsAdmin);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Results.BadRequest(new { error = "Pogrešan email ili lozinka" });
            }

            // Generate new session token
            var token = AuthService.GenerateToken();
            user.SessionToken = token;
            user.TokenExpiry = DateTime.UtcNow.AddDays(7);
            user.LastLoginAt = DateTime.UtcNow;
            user.LoginCount++;

            // Log activity
            db.ActivityLogs.Add(new ActivityLog
            {
                Type = ActivityType.UserLogin,
                UserId = user.Id,
                UserName = user.Name,
                UserEmail = user.Email,
                Description = $"Korisnik prijavljen: {user.Name}",
                CreatedAt = DateTime.UtcNow
            });

            await db.SaveChangesAsync();

            // Send login success email
            try
            {
                Console.WriteLine($"📨 About to send login success email to {user.Email}");
                await EmailService.SendLoginSuccessEmailAsync(user.Email, user.Name);
                Console.WriteLine($"✅ Login success email sent to {user.Email}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending login success email: {ex.Message}");
            }

            return Results.Ok(new {
                token,
                user = new { user.Id, user.Name, user.Email, user.Phone }
            });
        });

        // Admin login
        app.MapPost("/api/auth/admin/login", async (LoginRequest request, AuraDbContext db) =>
        {
            var admin = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.IsAdmin);

            if (admin == null || !BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
            {
                return Results.BadRequest(new { error = "Pogrešan email ili lozinka" });
            }

            // Generate new session token
            var token = AuthService.GenerateToken();
            admin.SessionToken = token;
            admin.TokenExpiry = DateTime.UtcNow.AddDays(1); // Admin token expires faster
            admin.LastLoginAt = DateTime.UtcNow;
            admin.LoginCount++;

            // Log activity
            db.ActivityLogs.Add(new ActivityLog
            {
                Type = ActivityType.AdminLogin,
                UserId = admin.Id,
                UserName = admin.Name,
                UserEmail = admin.Email,
                Description = $"Admin prijavljen: {admin.Name}",
                CreatedAt = DateTime.UtcNow
            });

            await db.SaveChangesAsync();

            return Results.Ok(new { token, isAdmin = true });
        });

        // Verify token (check if user is logged in) - produži token pri svakom pozivu
        app.MapGet("/api/auth/verify", async (HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return Results.Unauthorized();
            }

            var user = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.TokenExpiry > DateTime.UtcNow);

            if (user == null)
            {
                return Results.Unauthorized();
            }

            // Produži token za još 7 dana (ili 1 dan za admina) pri svakom verify pozivu
            user.TokenExpiry = DateTime.UtcNow.AddDays(user.IsAdmin ? 1 : 7);
            await db.SaveChangesAsync();

            return Results.Ok(new {
                user = new { user.Id, user.Name, user.Email, user.Phone },
                isAdmin = user.IsAdmin
            });
        });

        // Logout
        app.MapPost("/api/auth/logout", async (HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(token))
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token);
                if (user != null)
                {
                    // Log activity
                    db.ActivityLogs.Add(new ActivityLog
                    {
                        Type = ActivityType.UserLogout,
                        UserId = user.Id,
                        UserName = user.Name,
                        UserEmail = user.Email,
                        Description = $"Korisnik odjavljen: {user.Name}",
                        CreatedAt = DateTime.UtcNow
                    });

                    user.SessionToken = "";
                    user.TokenExpiry = DateTime.MinValue;
                    await db.SaveChangesAsync();
                }
            }

            return Results.Ok();
        });
    }
}
