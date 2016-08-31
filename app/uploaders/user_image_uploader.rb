class UserImageUploader < ImageUploader
  def default_url(*args)
    ActionController::Base.helpers.image_url("user-placeholder.png")
  end
end