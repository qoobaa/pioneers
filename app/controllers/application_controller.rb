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

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  #protect_from_forgery # See ActionController::RequestForgeryProtection for details

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
    session[:return_to] = request.request_uri
  end

  def redirect_back_or_default(default)
    redirect_to(session[:return_to] || default)
    session[:return_to] = nil
  end

  def stomp_send(game, message)
    stomp = Stomp::Client.new
    stomp.send("/games/#{game.id}", message.to_json)
    stomp.close
  end

  def game
    @game.to_hash(:cardPlayed => :current_turn_card_played,
                  :discardPlayer => :current_discard_player_number,
                  :phase => :phase,
                  :player => :current_player_number,
                  :roll => :current_dice_roll_value,
                  :state => :state,
                  :turn => :current_turn,
                  :winner => :winner_number,
                  :cards => :cards_count,
                  :players => [:players, { :number => :number, :resources => :resources, :points => :visible_points, :cards => :cards_count, :state => :state }])
  end

  def card
    @card.to_hash(:player => :player_number,
                  :id => :id,
                  :bricks => :bricks,
                  :grain => :grain,
                  :lumber => :lumber,
                  :ore => :ore,
                  :wool => :wool,
                  :resource => :resource_type,
                  :type => :class_name,
                  :state => :state)
  end

  def node
    @node.to_hash(:position => :position,
                  :player => :player_number,
                  :id => :id,
                  :state => :state)
  end

  def edge
    @edge.to_hash(:position => :position,
                  :player => :player_number)
  end

  def robbery
    @robbery.to_hash(:position => :position,
                     :sender => :sender_number,
                     :recipient => :recipient_number,
                     :bricks => :bricks,
                     :grain => :grain,
                     :lumber => :lumber,
                     :ore => :ore,
                     :wool => :wool)
  end

  def offer
    @offer.to_hash(:sender => :sender_number,
                   :recipient => :recipient_number,
                   :bricks => :bricks,
                   :grain => :grain,
                   :lumber => :lumber,
                   :ore => :ore,
                   :wool => :wool)
  end

  def exchange
    @exchange.to_hash(:player => :player_number,
                      :bricks => :bricks,
                      :grain => :grain,
                      :lumber => :lumber,
                      :ore => :ore,
                      :wool => :wool)
  end

  def discard
    @discard.to_hash(:player => :player_number,
                     :bricks => :bricks,
                     :grain => :grain,
                     :lumber => :lumber,
                     :ore => :ore,
                     :wool => :wool)
  end

  def offer_response
    @offer_response.to_hash(:player => :player_number,
                            :agreed => :agreed)
  end

end
