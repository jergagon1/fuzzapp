class Report < ActiveRecord::Base
  include Filterable
  FIELDS_FOR_SLUG = %i(report_type animal_type pet_name)
  #Filters
  before_save :downcase_fields
  after_save :subscribe_user_and_notify
  before_create :increment_wags!
  before_destroy :destroy_subscriptions
  after_save :generate_slug!
  mount_uploader :image, ImageUploader
  # associations
  has_many :comments
  has_many :subscriptions
  has_many :subscribers, through: :subscriptions, source: :user
  belongs_to :user
  # act as taggable
  acts_as_taggable
  acts_as_taggable
  #act as mappable
  acts_as_mappable default_units: :miles,
                   default_formula: :sphere,
                   distance_field_name: :distance,
                   lat_column_name: :lat,
                   lng_column_name: :lng
  # validations
  validates :user_id, presence: true

  # Scopes for Report filtering -> see Filterable module
  scope :report_type, -> (report_type) { where report_type: report_type }
  scope :animal_type, -> (animal_type) { where animal_type: animal_type }
  scope :sex, -> (sex) { where sex: sex }
  scope :pet_size, -> (pet_size) { where pet_size: pet_size }
  scope :age, -> (age) { where age: age }
  scope :breed, -> (breed) { where breed: breed }
  scope :color, -> (color) { where color: color }
  scope :image, -> (image) {where image: image}

  # Add report creator's username to json output
  # Todo look at ActiveModel Serializers to improve this
  def as_json options={}
    attributes.merge({
      report_username: user.username, report_taggings: tag_list,
      subscriptions: user.subscribed_reports.ids,
      image: get_image,
      normalized_title: normalized_title
    }).as_json
  end

  def get_image
    if image_url
      image.url(:normal)
    else
      case animal_type_normalized.downcase
      when 'pet'
        '/img/app/dog.png'
      when 'dog'
        '/img/app/dog.png'
      when 'cat'
        '/img/app/cat.png'
      when 'bird'
        '/img/app/bird.png'
      end
    end
  end

  def normalized_title
    %Q{#{report_type.capitalize}#{animal_type? ? " #{animal_type.capitalize}" : ' Pet'}#{pet_name? ? " #{pet_name.capitalize}" : ''}}
  end

  def animal_type_normalized
    if animal_type?
      animal_type
    else
      'pet'
    end.capitalize
  end

  def to_param
    slug
  end

  private

  def destroy_subscriptions
    subscriptions.map &:destroy
  end

  def generate_slug!
    update_column(:slug, normalize_slug("#{id}-#{FIELDS_FOR_SLUG.map { |field| normalize_field(field) }.flatten.join('-')}"))
  end

  def normalize_field(field)
    public_send(field).to_s.downcase.gsub(/\s+/, '-').gsub(/([^-a-z])/, '').presence
  end

  def normalize_slug(slug)
    slug.gsub("\n", '').gsub(/^\s+/, '').gsub(/\s+$/, '').gsub(/-+$/, '')
  end

  # update user wags if report_type is found pet
  def increment_wags!
    user.increment!(:wags) if report_type == 'found'
  end

  def subscribe_user_and_notify
    subscriptions.create(user: user)

    Notification.notify_about_new_report(self)
  end

  def downcase_fields
    self.breed.to_s.downcase!
    self.color.to_s.downcase!
  end
end
