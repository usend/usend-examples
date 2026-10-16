require "usend"

usend = Usend::Client.new(api_key: ENV["USEND_API_KEY"])

begin
  email = usend.emails.send_email(
    {
      from: "Acme <hello@acme.com>",
      to: ["ann@example.com"],
      subject: "Hello from usend",
      html: "<p>It works!</p>"
    },
    idempotency_key: "welcome-ann-1" # optional
  )
  puts "queued #{email["id"]}"
rescue Usend::Error => e
  warn "#{e.status_code} #{e.name}: #{e.message}"
  exit 1
end
