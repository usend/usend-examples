config :my_app, MyApp.Mailer,
  adapter: Swoosh.Adapters.SMTP,
  relay: "smtp.usend.et",
  port: 587,
  username: "usend",
  password: System.fetch_env!("USEND_API_KEY"),
  ssl: false,
  tls: :always,
  auth: :always
