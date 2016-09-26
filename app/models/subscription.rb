class Subscription < ActiveRecord::Base
	# association
  belongs_to :user
  belongs_to :report
  # validation
  validates :user_id, presence: true
  validates :report_id, presence: true
  validates :user_id, uniqueness: { scope: [:report_id] }
end
