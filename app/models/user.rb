class User < ActiveRecord::Base
  # acts_as_token_authenticatable
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable
          #:confirmable#, :omniauthable
  # validations
  validates :username, :email, presence: true
  validates :username, :email, uniqueness: true
  # assocation
  has_many :messages
  has_many :reports
  has_many :comments
  has_many :subscriptions
  has_many :subscribed_reports, through: :subscriptions, source: :report
  # filters
  after_create :send_notification
  # mount uploader
  mount_uploader :image, UserImageUploader

  def update_coordinates!(latitude, longitude)
    self.latitude = latitude
    self.longitude = longitude
    save
  end

  private

  def send_notification
    NotificationEmailer.welcome_email(self).deliver_now if valid?
  end
end
