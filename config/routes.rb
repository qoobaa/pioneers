ActionController::Routing::Routes.draw do |map|
  map.resource :user
  map.resource :user_session
  map.resources :games, :member => { :roll_dice => :put, :end_turn => :put } do |games|
    games.resource :player, :member => { :start => :put }
    games.resource :robber
    games.resources :nodes
    games.resources :edges
    games.resources :dice_rolls
  end
end
