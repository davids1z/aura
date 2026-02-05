using Microsoft.EntityFrameworkCore;
using development.Data;
using development.Models;
using development.Models.Requests;

namespace development.Endpoints;

public static class MenuEndpoints
{
    public static void MapMenuEndpoints(this WebApplication app)
    {
        // Get all menu items (public)
        app.MapGet("/api/menu", async (AuraDbContext db) =>
        {
            var items = await db.MenuItems
                .Where(m => m.IsAvailable)
                .OrderBy(m => m.Category)
                .ThenBy(m => m.SortOrder)
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    m.Description,
                    m.Price,
                    Category = m.Category.ToString(),
                    m.ImageUrl,
                    m.IsVegetarian,
                    m.IsVegan,
                    m.IsGlutenFree,
                    m.Allergens
                })
                .ToListAsync();

            return Results.Ok(items);
        });

        // Get all menu items including unavailable (admin)
        app.MapGet("/api/admin/menu", async (HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);
            if (admin == null) return Results.Unauthorized();

            var items = await db.MenuItems
                .OrderBy(m => m.Category)
                .ThenBy(m => m.SortOrder)
                .ToListAsync();

            return Results.Ok(items);
        });

        // Create menu item (admin)
        app.MapPost("/api/admin/menu", async (MenuItemRequest request, HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);
            if (admin == null) return Results.Unauthorized();

            var item = new MenuItem
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                DiscountPercent = request.DiscountPercent,
                DiscountEndDate = request.DiscountEndDate,
                Category = request.Category,
                ImageUrl = request.ImageUrl,
                IsAvailable = request.IsAvailable,
                IsVegetarian = request.IsVegetarian,
                IsVegan = request.IsVegan,
                IsGlutenFree = request.IsGlutenFree,
                Allergens = request.Allergens,
                SortOrder = request.SortOrder,
                CreatedAt = DateTime.UtcNow
            };

            db.MenuItems.Add(item);
            await db.SaveChangesAsync();
            return Results.Created($"/api/menu/{item.Id}", item);
        });

        // Update menu item (admin)
        app.MapPut("/api/admin/menu/{id}", async (int id, MenuItemRequest request, HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);
            if (admin == null) return Results.Unauthorized();

            var item = await db.MenuItems.FindAsync(id);
            if (item == null) return Results.NotFound();

            item.Name = request.Name;
            item.Description = request.Description;
            item.Price = request.Price;
            item.DiscountPercent = request.DiscountPercent;
            item.DiscountEndDate = request.DiscountEndDate;
            item.Category = request.Category;
            item.ImageUrl = request.ImageUrl;
            item.IsAvailable = request.IsAvailable;
            item.IsVegetarian = request.IsVegetarian;
            item.IsVegan = request.IsVegan;
            item.IsGlutenFree = request.IsGlutenFree;
            item.Allergens = request.Allergens;
            item.SortOrder = request.SortOrder;
            item.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return Results.Ok(item);
        });

        // Delete menu item (admin)
        app.MapDelete("/api/admin/menu/{id}", async (int id, HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);
            if (admin == null) return Results.Unauthorized();

            var item = await db.MenuItems.FindAsync(id);
            if (item == null) return Results.NotFound();

            db.MenuItems.Remove(item);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }
}
