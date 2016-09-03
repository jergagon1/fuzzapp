class MessagesController < ApplicationController
  respond_to :js

  def create
    if current_user.present? && current_user.id.to_s.eql?(message_params[:user_id])
      message = Message.new message_params
      if message.save
        message_html = render_to_string(partial: 'messages/message', locals: { message: message})
        Pusher[ENV['PUSHER_CHANNEL_NAME']].trigger('message_created', message_html)
        render json: message, status: 200
      else
        render json: { errors: message.errors.full_messages }, status: 422
      end
    else
      render json: {}, status: :unauthorized
    end
  end

  private

  def message_params
    params.required(:message).permit(:user_id, :body)
  end
end
