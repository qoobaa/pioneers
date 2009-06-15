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

class CardsController < ApplicationController
  before_filter :require_user, :fetch_game

  def index
    @player = @game.players.find_by_user_id(@current_user.id)
    @cards = @player.cards.with_state(:tapped, :untapped)
    respond_to do |format|
      format.json { render :json => { :cards => @cards.map { |card| { :id => card.id, :type => card.type, :state => card.state } } } }
    end
  end

  def create
    @card = @game.cards.build(params[:card])
    @card.user = @current_user
    if @card.save
      stomp_send(@game, { :game => game, :card => card })
      render :nothing => true, :status => :created
    else
      render :nothing => true, :status => :unprocessable_entity
    end
  end

  def update
    @card = @game.cards.find(params[:id])
    @card.attributes = params[:card]
    @card.user = @current_user
    if @card.update_attributes(params[:card])
      stomp_send(@game, { :game => game, :card => card })
      render :nothing => true, :status => :created
    else
      render :nothing => true, :status => :unprocessable_entity
    end
  end

  protected

  def fetch_game
    @game = Game.find(params[:game_id])
  end
end
