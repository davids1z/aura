namespace development.Models.Requests;

public class MenuItemRequest
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal Price { get; set; }
    public decimal DiscountPercent { get; set; } = 0;
    public DateTime? DiscountEndDate { get; set; }
    public MenuCategory Category { get; set; }
    public string ImageUrl { get; set; } = "";
    public bool IsAvailable { get; set; } = true;
    public bool IsVegetarian { get; set; }
    public bool IsVegan { get; set; }
    public bool IsGlutenFree { get; set; }
    public string Allergens { get; set; } = "";
    public int SortOrder { get; set; }
}
