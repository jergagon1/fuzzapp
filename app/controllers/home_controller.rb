class HomeController < ApplicationController
  def index
    @reports = Report.all.includes(:user)
  end
end
