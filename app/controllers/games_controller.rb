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
        game = @game.to_hash(:id => :id,
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
                                            :points => :visible_points,
                                            :resources => :resources,
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
                                            :roads => :roads }],
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
        game[:card] = @game.card.to_hash(:player => :player_number,
                                         :id => :id,
                                         :bricks => :bricks,
                                         :grain => :grain,
                                         :lumber => :lumber,
                                         :ore => :ore,
                                         :wool => :wool,
                                         :resource => :resource_type,
                                         :type => :card_type,
                                         :state => :state) if @game.card
        game[:userPlayer] = @user_player.number if @user_player
        game[:userCards] = @user_player.cards.without_state(:graveyard).map do |card|
          card.to_hash(:player => :player_number,
                       :id => :id,
                       :bricks => :bricks,
                       :grain => :grain,
                       :lumber => :lumber,
                       :ore => :ore,
                       :wool => :wool,
                       :resource => :resource_type,
                       :type => :card_type,
                       :state => :state)
        end if @user_player
        game[:offer] = @game.offer.to_hash(:sender => :sender_number,
                                           :recipient => :recipient_number,
                                           :bricks => :bricks,
                                           :grain => :grain,
                                           :lumber => :lumber,
                                           :ore => :ore,
                                           :wool => :wool,
                                           :state => :state,
                                           :responses => [:offer_responses,
                                                          { :player => :player_number, :agreed => :agreed }]) if @game.offer

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
