namespace development.Models.Requests;

public class DayScheduleRequest
{
    public bool IsOpen { get; set; }
    public string OpenTime { get; set; } = "12:00";
    public string CloseTime { get; set; } = "22:00";
}

public class TimeSlotRequest
{
    public string Time { get; set; } = "";
    public int MaxReservations { get; set; } = 10;
    public bool IsEnabled { get; set; } = true;
}

public class DateOverrideRequest
{
    public DateTime Date { get; set; }
    public bool IsClosed { get; set; }
    public string OpenTime { get; set; } = "";
    public string CloseTime { get; set; } = "";
    public string Reason { get; set; } = "";
}
