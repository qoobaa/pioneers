ActionController::Routing::Routes.draw do |map|
  map.resource :user
  map.resource :user_session
  map.resources :games, :member => { :start => :put, :roll => :put, :end_turn => :put } do |games|
    games.resources :players
    games.resources :nodes
    games.resources :edges
  end
end
