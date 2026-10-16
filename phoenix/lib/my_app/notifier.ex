defmodule MyApp.Notifier do
  def welcome(user) do
    client = Usend.new(System.fetch_env!("USEND_API_KEY"))

    Usend.send_email(
      client,
      %{
        from: "Acme <hello@acme.com>",
        to: [user.email],
        subject: "Welcome to Acme",
        html: "<p>Hi #{Plug.HTML.html_escape(user.name)}, welcome aboard.</p>"
      },
      idempotency_key: "welcome-#{user.id}"
    )
  end
end
