using Usend;

using var usend = new UsendClient(Environment.GetEnvironmentVariable("USEND_API_KEY"));

try
{
    var sent = await usend.Emails.SendAsync(new
    {
        from = "Acme <hello@acme.com>",
        to = new[] { "ann@example.com" },
        subject = "Hello from usend",
        html = "<p>It works!</p>",
    });
    Console.WriteLine($"queued: {sent.GetProperty("id").GetString()}");
}
catch (UsendException e)
{
    Console.Error.WriteLine($"failed {e.StatusCode} {e.ErrorName}: {e.Message}");
}
