CarrierWave.configure do |config|
  config.fog_provider = 'fog/aws'

  config.fog_credentials = {
    aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
    provider: 'AWS',
    region: 'eu-central-1',
    endpoint: 'http://s3.eu-central-1.amazonaws.com',
    path_style: true
  }

  config.fog_directory = 'vthdevtest'
  config.fog_public = true
end
