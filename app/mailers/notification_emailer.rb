class NotificationEmailer < ApplicationMailer
  def welcome_email(recipient)
    # mg_client = Mailgun::Client.new ENV['MAILGUN_API_KEY']
    #
    # message_params = {
    #   from:    'notifications@fuzzfinders.com',
    #   to:      recipient.email,
    #   subject: 'Welcome to Fuzzfinders!',
    #   text:    'Welcome to Fuzzfinders!'
    # }
    #
    # require 'pry'; binding.pry
    # mg_client.send_message ENV['MAILGUN_DOMAIN'], message_params

    mail to: recipient.email, subject: 'Welcome to Fuzzfinders!'
  end
end
