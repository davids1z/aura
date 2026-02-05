namespace development.Models;

public enum ReservationStatus
{
    Pending = 0,
    Confirmed = 1,
    Cancelled = 2,
    Completed = 3
}

public enum MenuCategory
{
    Appetizer = 0,    // Predjela
    Soup = 1,         // Juhe
    Salad = 2,        // Salate
    Pasta = 3,        // Tjestenina i rižoti
    Fish = 4,         // Ribe i plodovi mora
    Meat = 5,         // Meso
    Dessert = 6,      // Deserti
    Beverage = 7,     // Pića
    Special = 8       // Specijalitet dana
}

public enum DayOfWeekEnum
{
    Monday = 0,
    Tuesday = 1,
    Wednesday = 2,
    Thursday = 3,
    Friday = 4,
    Saturday = 5,
    Sunday = 6
}

public enum ActivityType
{
    UserRegistered = 0,
    UserLogin = 1,
    AdminLogin = 2,
    UserLogout = 3,
    ReservationCreated = 4,
    ReservationUpdated = 5,
    ReservationCancelled = 6,
    OrderCreated = 7,
    OrderUpdated = 8,
    OrderCancelled = 9
}

public enum OrderStatus
{
    Pending = 0,
    Confirmed = 1,
    Preparing = 2,
    OutForDelivery = 3,
    Delivered = 4,
    Cancelled = 5
}
