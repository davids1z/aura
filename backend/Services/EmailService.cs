using System.Text;
using development.Models;

namespace development.Services;

public static class EmailService
{
    private static readonly HttpClient _httpClient = new HttpClient();

    // Read config dynamically each time (in case env vars change)
    private static string GetResendApiKey() => Environment.GetEnvironmentVariable("RESEND_API_KEY") ?? "";
    // Resend requires verified domain or use their test address: onboarding@resend.dev
    private static string GetFromEmail() => Environment.GetEnvironmentVariable("FROM_EMAIL") ?? "onboarding@resend.dev";
    private const string FromName = "Aura Fine Dining";

    public static async Task SendWelcomeEmailAsync(string toEmail, string userName)
    {
        var apiKey = GetResendApiKey();

        Console.WriteLine($"📧 SendWelcomeEmailAsync called for {toEmail}");
        Console.WriteLine($"📧 Resend configured: {!string.IsNullOrEmpty(apiKey)} (length: {apiKey.Length})");

        if (string.IsNullOrEmpty(apiKey))
        {
            Console.WriteLine($"❌ Email not configured (RESEND_API_KEY missing) - would send welcome email to {toEmail}");
            return;
        }

        var subject = "Welcome to Aura Fine Dining!";
        var body = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 40px 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }}
        .header {{ background: #1c1917; padding: 40px; text-align: center; }}
        .header h1 {{ color: white; font-size: 28px; letter-spacing: 8px; margin: 0; font-weight: 300; }}
        .content {{ padding: 40px; }}
        .content h2 {{ color: #1c1917; font-size: 24px; margin-bottom: 20px; font-weight: 400; }}
        .content p {{ color: #57534e; line-height: 1.8; margin-bottom: 16px; }}
        .button {{ display: inline-block; background: #1c1917; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-top: 20px; }}
        .footer {{ background: #f5f5f4; padding: 30px; text-align: center; }}
        .footer p {{ color: #a8a29e; font-size: 12px; margin: 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>AURA</h1>
        </div>
        <div class='content'>
            <h2>Welcome, {userName}!</h2>
            <p>Thank you for registering at Aura Fine Dining. We are delighted to welcome you to our exclusive culinary experience.</p>
            <p>Your account has been successfully created. You can now:</p>
            <ul style='color: #57534e; line-height: 2;'>
                <li>Make reservations for our tasting menu</li>
                <li>Order delivery from our menu</li>
                <li>Receive exclusive offers and updates</li>
            </ul>
            <p>We look forward to serving you soon.</p>
            <a href='https://aura-dining.hr/reservation.html' class='button'>Make a Reservation</a>
        </div>
        <div class='footer'>
            <p>Aura Fine Dining | King Tomislav Square 1, Zagreb</p>
            <p>Tuesday - Saturday, 6:00 PM - 12:00 AM</p>
        </div>
    </div>
</body>
</html>";

        await SendEmailAsync(toEmail, subject, body);
    }

    public static async Task SendOrderConfirmationAsync(string toEmail, string customerName, Order order, List<OrderItem> items)
    {
        var apiKey = GetResendApiKey();

        Console.WriteLine($"📧 SendOrderConfirmationAsync called for {toEmail}");

        if (string.IsNullOrEmpty(apiKey))
        {
            Console.WriteLine($"❌ Email not configured (RESEND_API_KEY missing) - would send order confirmation to {toEmail}");
            return;
        }

        var itemsHtml = new StringBuilder();
        foreach (var item in items)
        {
            itemsHtml.Append($@"
                <tr>
                    <td style='padding: 12px 0; border-bottom: 1px solid #e7e5e4;'>{item.MenuItemName}</td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #e7e5e4; text-align: center;'>{item.Quantity}</td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #e7e5e4; text-align: right;'>{(item.Price * item.Quantity):F2} €</td>
                </tr>");
        }

        var subject = $"Order Confirmation #{order.Id} - Aura Fine Dining";
        var body = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 40px 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }}
        .header {{ background: #1c1917; padding: 40px; text-align: center; }}
        .header h1 {{ color: white; font-size: 28px; letter-spacing: 8px; margin: 0; font-weight: 300; }}
        .content {{ padding: 40px; }}
        .content h2 {{ color: #1c1917; font-size: 24px; margin-bottom: 20px; font-weight: 400; }}
        .content p {{ color: #57534e; line-height: 1.8; margin-bottom: 16px; }}
        .order-info {{ background: #f5f5f4; padding: 20px; border-radius: 12px; margin: 20px 0; }}
        .order-info p {{ margin: 8px 0; color: #44403c; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th {{ text-align: left; padding: 12px 0; border-bottom: 2px solid #1c1917; color: #1c1917; font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }}
        th:last-child {{ text-align: right; }}
        .total {{ font-size: 20px; font-weight: 500; color: #1c1917; text-align: right; padding-top: 20px; border-top: 2px solid #1c1917; margin-top: 10px; }}
        .footer {{ background: #f5f5f4; padding: 30px; text-align: center; }}
        .footer p {{ color: #a8a29e; font-size: 12px; margin: 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>AURA</h1>
        </div>
        <div class='content'>
            <h2>Thank you for your order!</h2>
            <p>Dear {customerName},</p>
            <p>We have received your order and it is being prepared with care. Below are your order details:</p>

            <div class='order-info'>
                <p><strong>Order Number:</strong> #{order.Id}</p>
                <p><strong>Date:</strong> {order.CreatedAt:MMMM dd, yyyy} at {order.CreatedAt:HH:mm}</p>
                <p><strong>Delivery Address:</strong> {order.DeliveryAddress}</p>
                <p><strong>Phone:</strong> {order.Phone}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th style='text-align: center;'>Qty</th>
                        <th style='text-align: right;'>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsHtml}
                </tbody>
            </table>

            <div class='total'>
                Total: {order.TotalAmount:F2} €
            </div>

            <p style='margin-top: 30px;'>We will contact you shortly to confirm the delivery time. If you have any questions, please don't hesitate to reach out.</p>
        </div>
        <div class='footer'>
            <p>Aura Fine Dining | King Tomislav Square 1, Zagreb</p>
            <p>Phone: +385 1 234 5678 | Email: info@aura-dining.hr</p>
        </div>
    </div>
</body>
</html>";

        await SendEmailAsync(toEmail, subject, body);
    }

    public static async Task SendLoginSuccessEmailAsync(string toEmail, string userName)
    {
        var apiKey = GetResendApiKey();

        Console.WriteLine($"📧 SendLoginSuccessEmailAsync called for {toEmail}");
        Console.WriteLine($"📧 Resend configured: {!string.IsNullOrEmpty(apiKey)} (length: {apiKey.Length})");

        if (string.IsNullOrEmpty(apiKey))
        {
            Console.WriteLine($"❌ Email not configured (RESEND_API_KEY missing) - would send login success email to {toEmail}");
            return;
        }

        var subject = "Uspješna prijava - Aura Fine Dining";
        var body = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 40px 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }}
        .header {{ background: #1c1917; padding: 40px; text-align: center; }}
        .header h1 {{ color: white; font-size: 28px; letter-spacing: 8px; margin: 0; font-weight: 300; }}
        .content {{ padding: 40px; }}
        .content h2 {{ color: #1c1917; font-size: 24px; margin-bottom: 20px; font-weight: 400; }}
        .content p {{ color: #57534e; line-height: 1.8; margin-bottom: 16px; }}
        .info-box {{ background: #f5f5f4; padding: 20px; border-radius: 12px; margin: 20px 0; }}
        .info-box p {{ margin: 8px 0; color: #44403c; }}
        .footer {{ background: #f5f5f4; padding: 30px; text-align: center; }}
        .footer p {{ color: #a8a29e; font-size: 12px; margin: 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>AURA</h1>
        </div>
        <div class='content'>
            <h2>Uspješna prijava</h2>
            <p>Pozdrav {userName},</p>
            <p>Upravo ste se uspješno prijavili na svoj račun u Aura Fine Dining.</p>
            <div class='info-box'>
                <p><strong>Vrijeme prijave:</strong> {DateTime.UtcNow:dd.MM.yyyy} u {DateTime.UtcNow:HH:mm} UTC</p>
            </div>
            <p>Ako niste vi izvršili ovu prijavu, molimo vas da odmah promijenite svoju lozinku ili nas kontaktirajte.</p>
        </div>
        <div class='footer'>
            <p>Aura Fine Dining | Trg kralja Tomislava 1, Zagreb</p>
            <p>Utorak - Subota, 18:00 - 00:00</p>
        </div>
    </div>
</body>
</html>";

        await SendEmailAsync(toEmail, subject, body);
    }

    private static async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        var apiKey = GetResendApiKey();
        var fromEmail = GetFromEmail();

        Console.WriteLine($"📧 SendEmailAsync starting for {toEmail}");
        Console.WriteLine($"📧 Using FROM: {FromName} <{fromEmail}>");
        Console.WriteLine($"📧 Resend API Key configured: {!string.IsNullOrEmpty(apiKey)} (length: {apiKey.Length})");

        if (string.IsNullOrEmpty(apiKey))
        {
            Console.WriteLine($"⚠️ RESEND_API_KEY not configured! Email to {toEmail} not sent.");
            return;
        }

        try
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
            request.Headers.Add("Authorization", $"Bearer {apiKey}");

            var payload = new
            {
                from = $"{FromName} <{fromEmail}>",
                to = new[] { toEmail },
                subject = subject,
                html = htmlBody
            };

            var jsonPayload = System.Text.Json.JsonSerializer.Serialize(payload);
            Console.WriteLine($"📧 Resend payload: from={fromEmail}, to={toEmail}, subject={subject}");

            request.Content = new StringContent(
                jsonPayload,
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"📧 Resend response status: {response.StatusCode}");
            Console.WriteLine($"📧 Resend response body: {responseBody}");

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine($"✅ Email sent via Resend to {toEmail}: {subject}");
            }
            else
            {
                Console.WriteLine($"❌ Resend API error ({response.StatusCode}): {responseBody}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Failed to send email via Resend to {toEmail}: {ex.Message}");
            Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
        }
    }
}
