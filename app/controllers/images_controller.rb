class ImagesController < ApplicationController
  def create
    # @image = Image.new(user: current_user)
    @image = Image.new(user: User.first)
    @image.image = params[:image]
    @image.save!
    render json: @image
  end
end
