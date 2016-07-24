class HomeController < ApplicationController
  layout :set_layout

  before_filter :authenticate_user!, only: %i(index profile)

  def index
    @reports = Report.all.includes(:user)
  end

  private

  def set_layout
    %w(facts faq findus fund main).include?(action_name) ? 'guest' : 'application'
  end
end
