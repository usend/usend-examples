class WelcomeEmailJob < ApplicationJob
  def perform(user)
    USEND.emails.send_email(
      {
        from: "Acme <hello@acme.com>",
        to: [user.email],
        subject: "Welcome",
        html: ApplicationController.render(template: "user_mailer/welcome", locals: { user: user })
      },
      idempotency_key: "welcome-#{user.id}"
    )
  end
end
