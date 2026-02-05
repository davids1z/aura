namespace development.Models;

public class DaySchedule
{
    public int Id { get; set; }
    public DayOfWeekEnum DayOfWeek { get; set; }
    public bool IsOpen { get; set; } = true;
    public string OpenTime { get; set; } = "12:00";
    public string CloseTime { get; set; } = "22:00";
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();
}
