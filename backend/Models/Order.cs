namespace development.Models;

public class Order
{
    public int Id { get; set; }
    public int? UserId { get; set; }  // Nullable for guest orders
    public string? CustomerName { get; set; }  // For guest orders
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public string DeliveryAddress { get; set; } = "";
    public string DeliveryCity { get; set; } = "";
    public string DeliveryPostalCode { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Notes { get; set; } = "";
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public User? User { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int MenuItemId { get; set; }
    public string MenuItemName { get; set; } = "";  // Snapshot of name at order time
    public decimal Price { get; set; }  // Snapshot of price at order time
    public int Quantity { get; set; }
    public string Notes { get; set; } = "";

    // Navigation properties
    public Order Order { get; set; } = null!;
    public MenuItem MenuItem { get; set; } = null!;
}
