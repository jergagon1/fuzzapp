class ContactMessage
  include ActiveModel::Model

  attr_accessor :name, :email, :message

  validates :name, :email, :message, presence: true, length: { in:5..255 }

end