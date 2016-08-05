class HomeController < ApplicationController
  layout :set_layout

  before_filter :authenticate_user!, only: %i(index profile)

  def index
    @reports = Report.all.includes(:user)
  end

  def main
    redirect_to :fuzzapp if current_user
  end

  private

  def set_layout
    if %w(faq facts findus fund main).include?(action_name)
      'new_application'
    else
     'application'
    end
  end
end
