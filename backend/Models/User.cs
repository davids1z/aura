namespace development.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public bool IsAdmin { get; set; }
    public string SessionToken { get; set; } = "";
    public DateTime TokenExpiry { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime LastLoginAt { get; set; }
    public int LoginCount { get; set; } = 0;

    // Navigation property
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
