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
    # if current_user
    #   'application'
    # else
    #   'new_application'
    # end
  end

  def authenticate_view
    unless current_user
      render "guest_#{action_name}"
    end
  end
end
