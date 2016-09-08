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

  def report
    # redirect_to "/fuzzapp/report/#{params[:id]}" and return if current_user

    @report = Report.find params[:id]

    render '/guests/report'
  end

  private

  def set_layout
    if %w(faq facts findus fund main).include?(action_name)
      current_user ? 'fuzzapp' : 'new_application'
    elsif action_name == 'report'
      'guests/report'
    else
      'application'
    end
  end

  def authenticate_view
    if action_name != 'report'
      render "guest_#{action_name}" unless current_user
    end
  end
end
