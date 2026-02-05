using System.Security.Cryptography;

namespace development.Services;

public static class AuthService
{
    public static string GenerateToken()
    {
        var bytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes);
    }

    // Formatira ime u "Ime P." format (veliko početno slovo imena + inicijal prezimena s točkom)
    public static string FormatDisplayName(string fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName)) return fullName;

        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0) return fullName;

        // Ime - veliko početno slovo, ostalo malo
        var firstName = char.ToUpper(parts[0][0]) + parts[0].Substring(1).ToLower();

        if (parts.Length == 1)
        {
            return firstName;
        }

        // Prezime - samo inicijal s točkom
        var lastNameInitial = char.ToUpper(parts[parts.Length - 1][0]) + ".";

        return $"{firstName} {lastNameInitial}";
    }
}
