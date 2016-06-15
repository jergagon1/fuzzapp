class ApplicationController < ActionController::Base
  respond_to :json, :html

  # acts_as_token_authentication_handler_for User #, fallback: :none
  #acts_as_token_authentication_handler_for User, except: :get_token #, fallback: :none
end
