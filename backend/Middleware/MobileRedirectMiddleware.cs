namespace development.Middleware;

public static class MobileRedirectMiddleware
{
    public static void UseMobileRedirect(this WebApplication app)
    {
        app.Use(async (context, next) =>
        {
            var userAgent = context.Request.Headers["User-Agent"].ToString().ToLower();
            var path = context.Request.Path.Value?.ToLower() ?? "";

            // Check if mobile browser
            var isMobile = userAgent.Contains("mobile") ||
                           userAgent.Contains("android") ||
                           userAgent.Contains("iphone") ||
                           userAgent.Contains("ipod") ||
                           userAgent.Contains("blackberry") ||
                           userAgent.Contains("windows phone");

            // Don't redirect if already going to mobile-angular, api, admin, or static assets
            if (isMobile &&
                !path.StartsWith("/mobile-angular") &&
                !path.StartsWith("/api") &&
                !path.StartsWith("/admin") &&
                !path.Contains(".") && // Skip files with extensions
                path != "/favicon.ico")
            {
                context.Response.Redirect("/mobile-angular/");
                return;
            }

            await next();
        });
    }
}
