using Microsoft.EntityFrameworkCore;
using development.Data;
using development.Models;
using development.Models.Requests;
using development.Services;

namespace development.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this WebApplication app)
    {
        // Create order (authenticated user)
        app.MapPost("/api/orders", async (HttpContext context, OrderRequest request, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var user = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && !u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (user == null)
            {
                return Results.Unauthorized();
            }

            if (request.Items == null || request.Items.Count == 0)
            {
                return Results.BadRequest(new { error = "Košarica je prazna" });
            }

            // Calculate total and create order items
            var orderItems = new List<OrderItem>();
            decimal totalAmount = 0;

            foreach (var item in request.Items)
            {
                var menuItem = await db.MenuItems.FindAsync(item.MenuItemId);
                if (menuItem == null || !menuItem.IsAvailable)
                {
                    return Results.BadRequest(new { error = $"Artikl nije dostupan" });
                }

                var orderItem = new OrderItem
                {
                    MenuItemId = menuItem.Id,
                    MenuItemName = menuItem.Name,
                    Price = menuItem.Price,
                    Quantity = item.Quantity,
                    Notes = item.Notes ?? ""
                };
                orderItems.Add(orderItem);
                totalAmount += menuItem.Price * item.Quantity;
            }

            var order = new Order
            {
                UserId = user.Id,
                Status = OrderStatus.Pending,
                DeliveryAddress = request.DeliveryAddress,
                DeliveryCity = request.DeliveryCity,
                DeliveryPostalCode = request.DeliveryPostalCode,
                Phone = request.Phone ?? user.Phone,
                Notes = request.Notes ?? "",
                TotalAmount = totalAmount,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Items = orderItems
            };

            db.Orders.Add(order);
            await db.SaveChangesAsync();

            // Log activity
            db.ActivityLogs.Add(new ActivityLog
            {
                Type = ActivityType.OrderCreated,
                UserId = user.Id,
                UserName = user.Name,
                UserEmail = user.Email,
                Description = $"Nova narudžba: {orderItems.Count} artikala, ukupno {totalAmount:F2} EUR",
                RelatedId = order.Id,
                CreatedAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();

            return Results.Created($"/api/orders/{order.Id}", new
            {
                order.Id,
                Status = order.Status.ToString(),
                order.TotalAmount,
                order.CreatedAt,
                ItemCount = orderItems.Count
            });
        });

        // Guest order (no authentication required)
        app.MapPost("/api/orders/guest", async (GuestOrderRequest request, AuraDbContext db) =>
        {
            if (request.Items == null || request.Items.Count == 0)
            {
                return Results.BadRequest(new { error = "Košarica je prazna" });
            }

            if (string.IsNullOrWhiteSpace(request.CustomerName))
            {
                return Results.BadRequest(new { error = "Ime je obavezno" });
            }

            if (string.IsNullOrWhiteSpace(request.Phone))
            {
                return Results.BadRequest(new { error = "Broj telefona je obavezan" });
            }

            if (string.IsNullOrWhiteSpace(request.DeliveryAddress))
            {
                return Results.BadRequest(new { error = "Adresa je obavezna" });
            }

            // Calculate total and create order items
            var orderItems = new List<OrderItem>();
            decimal totalAmount = 0;

            foreach (var item in request.Items)
            {
                var menuItem = await db.MenuItems.FindAsync(item.MenuItemId);
                if (menuItem == null || !menuItem.IsAvailable)
                {
                    return Results.BadRequest(new { error = $"Artikl nije dostupan" });
                }

                var orderItem = new OrderItem
                {
                    MenuItemId = menuItem.Id,
                    MenuItemName = menuItem.Name,
                    Price = menuItem.Price,
                    Quantity = item.Quantity,
                    Notes = item.Notes ?? ""
                };
                orderItems.Add(orderItem);
                totalAmount += menuItem.Price * item.Quantity;
            }

            var order = new Order
            {
                UserId = null,
                CustomerName = request.CustomerName,
                Status = OrderStatus.Pending,
                DeliveryAddress = request.DeliveryAddress,
                DeliveryCity = "",
                DeliveryPostalCode = "",
                Phone = request.Phone,
                Notes = request.Notes ?? "",
                TotalAmount = totalAmount,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Items = orderItems
            };

            db.Orders.Add(order);
            await db.SaveChangesAsync();

            // Log activity
            db.ActivityLogs.Add(new ActivityLog
            {
                Type = ActivityType.OrderCreated,
                UserId = null,
                UserName = request.CustomerName,
                UserEmail = request.Email ?? "gost",
                Description = $"Nova gost narudžba: {orderItems.Count} artikala, ukupno {totalAmount:F2} EUR",
                RelatedId = order.Id,
                CreatedAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();

            // Send order confirmation email
            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                _ = EmailService.SendOrderConfirmationAsync(request.Email, request.CustomerName, order, orderItems);
            }

            return Results.Created($"/api/orders/{order.Id}", new
            {
                order.Id,
                Status = order.Status.ToString(),
                order.TotalAmount,
                order.CreatedAt,
                ItemCount = orderItems.Count
            });
        });

        // Get user's orders
        app.MapGet("/api/my-orders", async (HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var user = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && !u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (user == null)
            {
                return Results.Unauthorized();
            }

            var orders = await db.Orders
                .Where(o => o.UserId == user.Id)
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    Status = o.Status.ToString(),
                    o.DeliveryAddress,
                    o.DeliveryCity,
                    o.TotalAmount,
                    o.CreatedAt,
                    Items = o.Items.Select(i => new
                    {
                        i.MenuItemName,
                        i.Price,
                        i.Quantity,
                        i.Notes
                    })
                })
                .ToListAsync();

            return Results.Ok(orders);
        });

        // Get all orders (admin)
        app.MapGet("/api/orders", async (HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (admin == null)
            {
                return Results.Unauthorized();
            }

            var orders = await db.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    o.CustomerName,
                    Status = o.Status.ToString(),
                    o.DeliveryAddress,
                    o.DeliveryCity,
                    o.DeliveryPostalCode,
                    o.Phone,
                    o.Notes,
                    o.TotalAmount,
                    o.CreatedAt,
                    o.UpdatedAt,
                    User = o.User != null ? new
                    {
                        o.User.Name,
                        o.User.Email,
                        o.User.Phone
                    } : null,
                    Items = o.Items.Select(i => new
                    {
                        i.Id,
                        i.MenuItemName,
                        i.Price,
                        i.Quantity,
                        i.Notes
                    })
                })
                .ToListAsync();

            return Results.Ok(orders);
        });

        // Update order status (admin)
        app.MapPut("/api/orders/{id}", async (int id, UpdateOrderRequest request, HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (admin == null)
            {
                return Results.Unauthorized();
            }

            var order = await db.Orders.Include(o => o.User).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return Results.NotFound();

            var oldStatus = order.Status;

            if (request.Status.HasValue)
                order.Status = request.Status.Value;
            if (request.Notes != null)
                order.Notes = request.Notes;

            order.UpdatedAt = DateTime.UtcNow;

            // Log activity
            var activityType = request.Status == OrderStatus.Cancelled
                ? ActivityType.OrderCancelled
                : ActivityType.OrderUpdated;

            db.ActivityLogs.Add(new ActivityLog
            {
                Type = activityType,
                UserId = order.UserId,
                UserName = order.User?.Name ?? "",
                UserEmail = order.User?.Email ?? "",
                Description = activityType == ActivityType.OrderCancelled
                    ? $"Narudžba #{order.Id} otkazana"
                    : $"Narudžba #{order.Id} ažurirana: {oldStatus} -> {order.Status}",
                RelatedId = order.Id,
                CreatedAt = DateTime.UtcNow
            });

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                order.Id,
                Status = order.Status.ToString(),
                order.UpdatedAt
            });
        });

        // Delete order (admin)
        app.MapDelete("/api/orders/{id}", async (int id, HttpContext context, AuraDbContext db) =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            var admin = await db.Users.FirstOrDefaultAsync(u => u.SessionToken == token && u.IsAdmin && u.TokenExpiry > DateTime.UtcNow);

            if (admin == null)
            {
                return Results.Unauthorized();
            }

            var order = await db.Orders.FindAsync(id);
            if (order == null) return Results.NotFound();

            db.Orders.Remove(order);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }
}
