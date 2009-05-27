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

class PlayersController < ApplicationController
  before_filter :require_user, :fetch_game

  def show
    @player = @game.players.find_by_user_id(@current_user.id)
    respond_to do |format|
      format.json { render :json => { :player => player } }
    end
  end

  def create
    @player = @game.players.build
    @player.user = @current_user
    if @player.save
      flash[:success] = "Successfully joined"
    else
      flash[:error] = "Could not join"
    end
    redirect_to game_path(@game)
  end

  def update
    @player = @game.players.find_by_user_id(@current_user.id)
    if @player.update_attributes(params[:player])
      flash[:success] = "Successfully updated"
    else
      flash[:error] = "Could not update"
    end
    redirect_to game_path(@game)
  end

  def destroy
    @player = @game.players.find_by_user_id(@current_user.id)
    if @player.destroy
      flash[:success] = "Successfully destroyed"
    else
      flash[:error] = "Could not destroy"
    end
    redirect_to game_path(@game)
  end

  protected

  def fetch_game
    @game = Game.find(params[:game_id])
  end
end
