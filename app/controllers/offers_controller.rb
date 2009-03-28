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

class OffersController < ApplicationController
  before_filter :require_user, :fetch_game

  def create
    @offer = @game.offers.build(params[:offer])
    @offer.user = @current_user
    if @offer.save
      flash[:success] = "Successfully created"
    else
      flash[:error] = "Could not create"
    end
    redirect_to game_path(@game)
  end

  def update
    @offer = @game.offers.first
    @offer.user = @current_user
    if @offer.accept
      flash[:success] = "Successfully accepted"
    else
      flash[:error] = "Could not accept"
    end
    redirect_to game_path(@game)
  end

  def destroy
    @offer = @game.offers.first
    @offer.user = @current_user
    if @offer.decline
      flash[:success] = "Successfully declined"
    else
      flash[:error] = "Could not decline"
    end
    redirect_to game_path(@game)
  end

  protected

  def fetch_game
    @game = Game.find(params[:game_id])
  end
end
