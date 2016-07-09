class HomeController < ApplicationController
  layout :set_layout

  def index
    @reports = Report.all.includes(:user)
  end

  def facts
  end

  def faq
  end

private

  def set_layout
    %w(facts faq).include?(action_name) ? "guest" : "application"
  end
end
