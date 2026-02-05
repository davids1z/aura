namespace development.Models;

// Special date override (holidays, events)
public class DateOverride
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public bool IsClosed { get; set; }
    public string OpenTime { get; set; } = "";
    public string CloseTime { get; set; } = "";
    public string Reason { get; set; } = "";  // "Božić", "Privatna zabava"
    public DateTime CreatedAt { get; set; }
}
