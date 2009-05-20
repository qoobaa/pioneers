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

class GamesController < ApplicationController
  before_filter :require_user, :except => [:index, :show]

  def index
    @games = Game.all
  end

  def show
    @game = Game.find(params[:id], include: { board: [:hexes, :nodes, :edges], players: [:user, :cards] })
    @user_player = @game.players.find_by_user_id(current_user.try(:id))
    respond_to do |format|
      format.html
      format.json do
        game = @game.to_hash(:cardPlayed => :current_turn_card_played,
                             :discardPlayer => :current_discard_player_number,
                             :discardLimit => :current_discard_resource_limit,
                             :phase => :phase,
                             :player => :current_player_number,
                             :roll => :current_dice_roll_value,
                             :state => :state,
                             :turn => :current_turn,
                             :winner => :winner_number,
                             :cards => :cards_count,
                             :players => [:players,
                                          { :number => :number,
                                            :state => :state,
                                            :name => :user_login,
                                            :cards => :cards_count,
                                            :bricks => :bricks,
                                            :bricksRate => :bricks_exchange_rate,
                                            :grain => :grain,
                                            :grainRate => :grain_exchange_rate,
                                            :lumber => :lumber,
                                            :lumberRate => :lumber_exchange_rate,
                                            :ore => :ore,
                                            :oreRate => :ore_exchange_rate,
                                            :wool => :wool,
                                            :woolRate => :wool_exchange_rate,
                                            :settlements => :settlements,
                                            :cities => :cities,
                                            :roads => :roads,
                                            :visiblePoints => :visible_points,
                                            :resources => :resources }],
                             :board => [:board,
                                        { :nodes => [:nodes,
                                                     { :position => :position,
                                                       :player => :player_number,
                                                       :state => :state,
                                                       :id => :id }],
                                          :hexes => [:hexes,
                                                     { :position => :position,
                                                       :roll => :roll,
                                                       :type => :hex_type,
                                                       :harborPosition => :harbor_position,
                                                       :harborType => :harbor_type}],
                                          :edges => [:edges,
                                                     { :position => :position,
                                                       :player => :player_number }],
                                          :size => :size,
                                          :robberPosition => :robber_position}])
        game[:userPlayer] = @user_player.number if @user_player
        render :json => { :game => game }
      end
    end
  end

  def update
    @game = Game.find(params[:id])
    @game.user = @current_user
    if @game.update_attributes(params[:game])
      stomp_send(@game, { :game => game })
      render :nothing => true, :status => :created
    else
      render :nothing => true, :status => :unprocessable_entity
    end
  end
end
