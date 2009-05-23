# -*- coding: utf-8 -*-

# Pioneers - web game based on the Settlers of Catan board game.
#
# Copyright (C) 2009 Jakub Kuźma <qoobaa@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

ActionController::Routing::Routes.draw do |map|
  map.resource :user
  map.resource :user_session
  map.resources :games do |games|
    games.resource :player
    games.resource :offer
    games.resource :offer_response
    games.resources :robberies
    games.resources :exchanges
    games.resources :cards
    games.resources :nodes
    games.resources :edges
    games.resources :hexes
    games.resources :dice_rolls
    games.resources :discards
  end
  map.root :controller => "games", :action => "index"
end
