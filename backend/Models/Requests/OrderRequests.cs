namespace development.Models.Requests;

public class OrderRequest
{
    public string DeliveryAddress { get; set; } = "";
    public string DeliveryCity { get; set; } = "";
    public string DeliveryPostalCode { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Notes { get; set; } = "";
    public List<OrderItemRequest> Items { get; set; } = new();
}

public class OrderItemRequest
{
    public int MenuItemId { get; set; }
    public int Quantity { get; set; }
    public string Notes { get; set; } = "";
}

public class UpdateOrderRequest
{
    public OrderStatus? Status { get; set; }
    public string? Notes { get; set; }
}

public class GuestOrderRequest
{
    public string CustomerName { get; set; } = "";
    public string Email { get; set; } = "";
    public string DeliveryAddress { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Notes { get; set; } = "";
    public List<OrderItemRequest> Items { get; set; } = new();
}
