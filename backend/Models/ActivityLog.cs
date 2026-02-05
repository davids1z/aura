namespace development.Models;

public class ActivityLog
{
    public int Id { get; set; }
    public ActivityType Type { get; set; }
    public int? UserId { get; set; }
    public string UserName { get; set; } = "";
    public string UserEmail { get; set; } = "";
    public string Description { get; set; } = "";
    public int? RelatedId { get; set; }  // ReservationId, etc.
    public DateTime CreatedAt { get; set; }

    // Navigation property
    public User? User { get; set; }
}
