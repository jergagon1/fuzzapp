class HomeController < ApplicationController
  layout :set_layout

  before_filter :authenticate_user!, only: %i(index profile)

  def index
    @reports = Report.all.includes(:user)
  end

  private

  def set_layout
    if %w(faq).include?(action_name)
     'guest'
    elsif %w(facts findus fund main).include?(action_name)
      'new_application'
    else
     'application'
    end
  end
end
