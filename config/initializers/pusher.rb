require 'pusher'
# $pusher = Pusher::Client.new app_id: ENV['PUSHER_APP_ID'], key: ENV['PUSHER_KEY'], secret: ENV['PUSHER_SECRET']

Pusher.app_id = ENV['PUSHER_APP_ID']
Pusher.key = ENV['PUSHER_KEY']
Pusher.secret = ENV['PUSHER_SECRET']
Pusher.cluster = 'eu'
Pusher.logger = Rails.logger
Pusher.encrypted = false
