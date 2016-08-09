class HomeController < ApplicationController
  layout :set_layout

  before_filter :authenticate_user!, only: %i(index profile)
  before_filter :authenticate_view, except: :main

  def index
    @reports = Report.all.includes(:user)
  end

  def main
    redirect_to :fuzzapp if current_user
  end


  def facts
  end
  def faq
  end
  def findus
  end
  def fund
  end

  private

  def set_layout
    if %w(faq facts findus fund main).include?(action_name)
      current_user ? 'fuzzapp' : 'new_application'
    else
     'application'
    end
  end

  def authenticate_view
    render "guest_#{action_name}" unless current_user
  end
end
