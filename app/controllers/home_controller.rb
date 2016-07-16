class HomeController < ApplicationController
  layout :set_layout

  # before_filter :authenticate_user!

  def index
    @reports = Report.all.includes(:user)
  end

  def facts
  end

  def faq
  end

  def findus
  end

  def fund
  end

  def main
  end

private

  def set_layout
    %w(facts faq findus fund main).include?(action_name) ? "guest" : "application"
  end
end
