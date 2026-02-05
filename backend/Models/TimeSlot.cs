namespace development.Models;

public class TimeSlot
{
    public int Id { get; set; }
    public int DayScheduleId { get; set; }
    public string Time { get; set; } = "";      // "12:00", "12:30", "13:00"...
    public int MaxReservations { get; set; } = 10;
    public bool IsEnabled { get; set; } = true;

    // Navigation property
    public DaySchedule DaySchedule { get; set; } = null!;
}
