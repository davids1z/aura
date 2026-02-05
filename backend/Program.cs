using Microsoft.EntityFrameworkCore;
using development.Data;
using development.Endpoints;
using development.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add PostgreSQL Database
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

string connectionString;
if (!string.IsNullOrEmpty(databaseUrl) && databaseUrl.StartsWith("postgresql://"))
{
    // Parse DATABASE_URL: postgresql://user:password@host/database?sslmode=require
    var urlParts = databaseUrl.Split('?');
    var urlWithoutQuery = urlParts[0];
    var queryString = urlParts.Length > 1 ? urlParts[1] : "";
    var uri = new Uri(urlWithoutQuery);
    var database = uri.AbsolutePath.TrimStart('/');

    // Safely parse user info
    var username = "";
    var password = "";
    if (!string.IsNullOrEmpty(uri.UserInfo))
    {
        var colonIndex = uri.UserInfo.IndexOf(':');
        if (colonIndex > 0)
        {
            username = Uri.UnescapeDataString(uri.UserInfo.Substring(0, colonIndex));
            password = Uri.UnescapeDataString(uri.UserInfo.Substring(colonIndex + 1));
        }
        else
        {
            username = Uri.UnescapeDataString(uri.UserInfo);
        }
    }

    // Check for sslmode in query string
    var sslMode = "Require"; // default for cloud databases
    if (queryString.Contains("sslmode=disable"))
    {
        sslMode = "Disable";
    }
    else if (queryString.Contains("sslmode=prefer"))
    {
        sslMode = "Prefer";
    }

    connectionString = $"Host={uri.Host};Database={database};Username={username};Password={password};SSL Mode={sslMode};Trust Server Certificate=true";
    Console.WriteLine($"Connecting to: {uri.Host}/{database} as {username} (SSL: {sslMode})");
}
else
{
    connectionString = "Host=localhost;Port=5432;Database=auradb;Username=aura;Password=aura123";
    Console.WriteLine("Using local database");
}

builder.Services.AddDbContext<AuraDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// Log email configuration at startup
var resendKey = Environment.GetEnvironmentVariable("RESEND_API_KEY") ?? "";
var fromEmail = Environment.GetEnvironmentVariable("FROM_EMAIL") ?? "onboarding@resend.dev";
Console.WriteLine($"🚀 Email service config: RESEND_API_KEY = {(string.IsNullOrEmpty(resendKey) ? "NOT SET" : $"SET (length: {resendKey.Length})")}");
Console.WriteLine($"🚀 Email FROM address: {fromEmail}");

app.UseCors();

// Mobile detection and redirect
app.UseMobileRedirect();

app.UseDefaultFiles();
app.UseStaticFiles();

// Seed database
DataSeeder.Seed(app.Services);

// Map all endpoints
app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapReservationEndpoints();
app.MapMenuEndpoints();
app.MapScheduleEndpoints();
app.MapDateOverrideEndpoints();
app.MapOrderEndpoints();

// SPA fallback for Angular app and desktop index - must be after all other endpoints
app.MapFallback(async context =>
{
    var path = context.Request.Path.Value?.ToLower() ?? "";
    if (path.StartsWith("/mobile-angular"))
    {
        // Serve Angular SPA for mobile
        context.Response.ContentType = "text/html";
        await context.Response.SendFileAsync(
            Path.Combine(app.Environment.WebRootPath, "mobile-angular", "index.html")
        );
    }
    else if (!path.Contains("."))
    {
        // Serve desktop index.html for non-file paths
        var indexPath = Path.Combine(app.Environment.WebRootPath, "index.html");
        if (File.Exists(indexPath))
        {
            context.Response.ContentType = "text/html";
            await context.Response.SendFileAsync(indexPath);
        }
        else
        {
            context.Response.StatusCode = 404;
        }
    }
    else
    {
        context.Response.StatusCode = 404;
    }
});

app.Run();
