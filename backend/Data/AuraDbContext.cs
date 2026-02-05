using Microsoft.EntityFrameworkCore;
using development.Models;

namespace development.Data;

public class AuraDbContext : DbContext
{
    public AuraDbContext(DbContextOptions<AuraDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<DaySchedule> DaySchedules { get; set; }
    public DbSet<TimeSlot> TimeSlots { get; set; }
    public DbSet<DateOverride> DateOverrides { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ===== USER & RESERVATION =====
        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reservations)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Reservation>()
            .HasIndex(r => r.Date);

        modelBuilder.Entity<Reservation>()
            .HasIndex(r => r.Status);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // ===== MENU =====
        modelBuilder.Entity<MenuItem>()
            .HasIndex(m => m.Category);

        modelBuilder.Entity<MenuItem>()
            .HasIndex(m => m.IsAvailable);

        modelBuilder.Entity<MenuItem>()
            .Property(m => m.Price)
            .HasPrecision(10, 2);  // Do 99,999,999.99

        // ===== SCHEDULE =====
        modelBuilder.Entity<DaySchedule>()
            .HasIndex(d => d.DayOfWeek)
            .IsUnique();

        modelBuilder.Entity<TimeSlot>()
            .HasOne(t => t.DaySchedule)
            .WithMany(d => d.TimeSlots)
            .HasForeignKey(t => t.DayScheduleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TimeSlot>()
            .HasIndex(t => new { t.DayScheduleId, t.Time })
            .IsUnique();

        modelBuilder.Entity<DateOverride>()
            .HasIndex(d => d.Date)
            .IsUnique();

        // ===== ACTIVITY LOG =====
        modelBuilder.Entity<ActivityLog>()
            .HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<ActivityLog>()
            .HasIndex(a => a.Type);

        modelBuilder.Entity<ActivityLog>()
            .HasIndex(a => a.CreatedAt);

        // ===== ORDERS =====
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany()
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.Status);

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.CreatedAt);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(10, 2);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.MenuItem)
            .WithMany()
            .HasForeignKey(oi => oi.MenuItemId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.Price)
            .HasPrecision(10, 2);
    }
}
