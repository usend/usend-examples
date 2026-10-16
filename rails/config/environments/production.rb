config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  address: "smtp.usend.et",
  port: 587,
  user_name: "usend",
  password: ENV.fetch("USEND_API_KEY"),
  authentication: :plain,
  enable_starttls_auto: true
}
