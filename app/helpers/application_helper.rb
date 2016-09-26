module ApplicationHelper
	def menu_navigation_style
	 	request[:action] == 'profile' ? "navigation-blue" : ""
	end
	def title(page_title)
  	content_for :title, page_title.to_s
	end
end
