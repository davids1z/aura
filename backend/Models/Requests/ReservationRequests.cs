namespace development.Models.Requests;

public class ReservationRequest
{
    public DateTime Date { get; set; }
    public string Time { get; set; } = "";
    public int Guests { get; set; }
    public string? SpecialRequests { get; set; }
}

public class UpdateReservationRequest
{
    public ReservationStatus? Status { get; set; }
    public int? TableNumber { get; set; }
    public string AdminNotes { get; set; } = "";
}
