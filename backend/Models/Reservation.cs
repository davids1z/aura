namespace development.Models;

public class Reservation
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public string Time { get; set; } = "";
    public int Guests { get; set; }
    public int TableNumber { get; set; } = 0;  // 0 = not assigned yet
    public ReservationStatus Status { get; set; } = ReservationStatus.Pending;
    public string SpecialRequests { get; set; } = "";
    public string AdminNotes { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public User User { get; set; } = null!;
}
