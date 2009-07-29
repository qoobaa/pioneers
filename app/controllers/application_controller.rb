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

# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

require "stomp"

class ApplicationController < ActionController::Base
  helper :all

  filter_parameter_logging :password, :password_confirmation
  helper_method :current_user_session, :current_user

  protected

  def current_user_session
    return @current_user_session if defined?(@current_user_session)
    @current_user_session = UserSession.find
  end

  def current_user
    return @current_user if defined?(@current_user)
    @current_user = current_user_session && current_user_session.user
  end

  def require_user
    unless current_user
      store_location
      flash[:notice] = "You must be logged in to access this page"
      redirect_to new_user_session_path
      return false
    end
  end

  def require_no_user
    if current_user
      store_location
      flash[:notice] = "You must be logged out to access this page"
      redirect_to user_path
      return false
    end
  end

  def store_location
    session[:return_to] = request.request_uri if request.get?
  end

  def redirect_back_or_default(default)
    redirect_to(session[:return_to] || default)
    session[:return_to] = nil
  end

  # def stomp_send(game, message)
  #   stomp = Stomp::Client.new
  #   stomp.send("/games/#{game.id}", message.to_json)
  #   stomp.close
  # rescue Errno::ECONNREFUSED
  #   Rails.logger.error "The Orbited server appears to be down!"
  # end

  # def game
  #   @game.reload
  #   @game.to_hash(:cardPlayed => :current_turn_card_played,
  #                 :discardPlayer => :current_discard_player_number,
  #                 :discardLimit => :current_discard_resource_limit,
  #                 :phase => :phase,
  #                 :player => :current_player_number,
  #                 :roll => :current_dice_roll_value,
  #                 :state => :state,
  #                 :turn => :current_turn,
  #                 :winner => :winner_number,
  #                 :cards => :cards_count,
  #                 :players => [:players,
  #                              { :number => :number,
  #                                :state => :state,
  #                                :name => :user_login,
  #                                :cards => :cards_count,
  #                                :points => :visible_points,
  #                                :resources => :resources,
  #                                :bricks => :bricks,
  #                                :bricksRate => :bricks_exchange_rate,
  #                                :grain => :grain,
  #                                :grainRate => :grain_exchange_rate,
  #                                :lumber => :lumber,
  #                                :lumberRate => :lumber_exchange_rate,
  #                                :ore => :ore,
  #                                :oreRate => :ore_exchange_rate,
  #                                :wool => :wool,
  #                                :woolRate => :wool_exchange_rate,
  #                                :settlements => :settlements,
  #                                :cities => :cities,
  #                                :roads => :roads }])
  # end

  # def card
  #   @card.reload
  #   @card.to_hash(:player => :player_number,
  #                 :id => :id,
  #                 :bricks => :bricks,
  #                 :grain => :grain,
  #                 :lumber => :lumber,
  #                 :ore => :ore,
  #                 :wool => :wool,
  #                 :resource => :resource_type,
  #                 :type => :class_name,
  #                 :state => :state)
  # end

  # def node
  #   @node.reload
  #   @node.to_hash(:position => :position,
  #                 :player => :player_number,
  #                 :state => :state)
  # end

  # def edge
  #   @edge.reload
  #   @edge.to_hash(:position => :position,
  #                 :player => :player_number)
  # end

  # def robbery
  #   @robbery.reload
  #   @robbery.to_hash(:position => :position,
  #                    :sender => :sender_number,
  #                    :recipient => :recipient_number)
  # end

  # def offer
  #   @offer.reload
  #   @offer.to_hash(:id => :id,
  #                  :sender => :sender_number,
  #                  :recipient => :recipient_number,
  #                  :bricks => :bricks,
  #                  :grain => :grain,
  #                  :lumber => :lumber,
  #                  :ore => :ore,
  #                  :wool => :wool,
  #                  :state => :state)
  # end

  # def exchange
  #   @exchange.reload
  #   @exchange.to_hash(:player => :player_number,
  #                     :bricks => :bricks,
  #                     :grain => :grain,
  #                     :lumber => :lumber,
  #                     :ore => :ore,
  #                     :wool => :wool)
  # end

  # def discard
  #   @discard.reload
  #   @discard.to_hash(:player => :player_number,
  #                    :bricks => :bricks,
  #                    :grain => :grain,
  #                    :lumber => :lumber,
  #                    :ore => :ore,
  #                    :wool => :wool)
  # end

  # def offer_response
  #   @offer_response.reload
  #   @offer_response.to_hash(:player => :player_number,
  #                           :agreed => :agreed)
  # end

  # def cards
  #   @cards.reload
  #   @cards.to_hash(:id, :type, :state)
  # end

  def game
    @game.reload
    @user_player = @game.players.find_by_user_id(current_user.try(:id))
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
    if @game.card
      game[:card] = @game.card.to_hash(:player => :player_number,
                                     :id => :id,
                                     :bricks => :bricks,
                                     :grain => :grain,
                                     :lumber => :lumber,
                                     :ore => :ore,
                                     :wool => :wool,
                                     :resource => :resource_type,
                                     :type => :card_type,
                                       :state => :state)
    else
      game[:card] = nil
    end

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
    game
  end
end
