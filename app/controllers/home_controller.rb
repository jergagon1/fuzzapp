class HomeController < ApplicationController
  layout :set_layout

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

private

  def set_layout
    %w(facts faq findus fund).include?(action_name) ? "guest" : "application"
  end
end
