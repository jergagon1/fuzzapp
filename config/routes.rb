Rails.application.routes.draw do
  # root page
  root 'home#main'
  # static pages
  get 'facts', to: 'home#facts'
  get 'profile', to: 'home#profile'
  get 'faq', to: 'home#faq'
  get 'findhelp', to: 'home#findus'
  post 'findus', to: 'home#findus', as: :contact_messages
  get 'fund', to: 'home#fund'
  get 'fuzzapp', to: 'home#index'
  get 'fuzzapp/*all', to: 'home#index'
  # Reports
  resources :reports, only: :show, to: 'home#report'
  # guest pages
  get 'legal', to: 'guests#legal'
  # Messages 
  resources :messages, only: [:create]
  # Users
  resources :users do
    post :update_coordinates, on: :collection
  end
  # Devise Authentication
  # API
  scope :api do
    scope :v1 do
      devise_for :users, controllers: {
        registrations: 'registrations',
        # sessions: 'sessions',
        passwords: 'passwords'
      }
      resources :subscriptions, only: [:index]
      resources :users, only: [:update]
      # resources :users, only: [:update] do
      #   get :get_token, on: :member
      # end
      resources :images, only: [:create]
      resources :reports, only: [:create, :update, :show] do
        get :mapquery, on: :collection
        resources :comments, only: [:create, :index]
      end
    end
  end
  match '/api/v1/status', to: 'reports#status', via: [:get, :options]
  match '/api/v1/wags', to: 'users#wags', via: [:get, :options]

  # TODO: rewrite all routes in resource style

  # FuzzFinders Reports
  # match '/api/v1/reports', to: 'reports#create', via: [:post, :options]
  # match '/api/v1/reports/:report_id', to: 'reports#update', via: [:put, :options]
  # match '/api/v1/reports/:report_id', to: 'reports#destroy', via: [:delete, :options]

  # match '/api/v1/reports/:report_id/comments', to: 'comments#index', via: [:get, :options]
  # match '/api/v1/reports/:report_id/comments', to: 'comments#create', via: [:post, :options]
  # match '/api/v1/reports/:report_id/comments/:comment_id', to: 'comments#update', via: [:put, :options]
  # match '/api/v1/reports/:report_id/comments/:comment_id', to: 'comments#destroy', via: [:delete, :options]

  # match '/api/v1/reports/mapquery', to: 'reports#mapquery', via: [:get, :options]
  # match '/api/v1/reports/:report_id', to: 'reports#show', via: [:get, :options]

  # User Auth
  # match '/api/v1/users', to: 'users#create', via: [:post, :options]
  # match '/api/v1/logged_in', to: 'users#logged_in', via: [:get, :options]
  # match '/api/v1/log_in', to: 'users#log_in', via: [:put, :options]
  # match '/api/v1/log_out', to: 'users#log_out', via: [:put, :options]
end
