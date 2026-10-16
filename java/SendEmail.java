import et.usend.Usend;
import et.usend.UsendException;
import java.util.List;
import java.util.Map;

public class SendEmail {
    public static void main(String[] args) {
        Usend usend = new Usend(System.getenv("USEND_API_KEY"));
        try {
            Map<String, Object> sent = usend.emails.send(Map.of(
                "from", "Acme <hello@acme.com>",
                "to", List.of("ann@example.com"),
                "subject", "Hello from usend",
                "html", "<p>It works!</p>"));
            System.out.println("queued: " + sent.get("id"));
        } catch (UsendException e) {
            System.err.println("failed " + e.getStatusCode() + " " + e.getErrorName() + ": " + e.getMessage());
            System.exit(1);
        }
    }
}
