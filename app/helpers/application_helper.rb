module ApplicationHelper

  def menu_navigation_style
     request[:action] == 'profile' ? "navigation-blue" : ""
  end

end
