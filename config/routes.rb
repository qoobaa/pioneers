ActionController::Routing::Routes.draw do |map|
  map.resource :user
  map.resource :user_session
  map.resources :games, :member => { :end_phase => :put } do |games|
    games.resource :player
    games.resource :robber
    games.resources :nodes
    games.resources :edges
  end
end
