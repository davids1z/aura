namespace development.Models;

public class MenuItem
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal Price { get; set; }
    public decimal DiscountPercent { get; set; } = 0; // 0-100
    public DateTime? DiscountEndDate { get; set; }
    public MenuCategory Category { get; set; }
    public string ImageUrl { get; set; } = "";
    public bool IsAvailable { get; set; } = true;
    public bool IsVegetarian { get; set; }
    public bool IsVegan { get; set; }
    public bool IsGlutenFree { get; set; }
    public string Allergens { get; set; } = "";
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Calculated property for discounted price
    public decimal DiscountedPrice => DiscountPercent > 0 && (!DiscountEndDate.HasValue || DiscountEndDate > DateTime.UtcNow)
        ? Price * (1 - DiscountPercent / 100)
        : Price;

    public bool HasActiveDiscount => DiscountPercent > 0 && (!DiscountEndDate.HasValue || DiscountEndDate > DateTime.UtcNow);
}
