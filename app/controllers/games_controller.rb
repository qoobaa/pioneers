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
    @game = Game.find(params[:id])
  end

  def update
    @game = Game.find(params[:id])
    @game.user = @current_user
    if @game.update_attributes(params[:game])
      flash[:success] = "Success"
    else
      flash[:error] = "Error"
    end
    redirect_to game_path(@game)
  end

  def roll_dice
    @game = Game.find(params[:id])
    if @game.roll_dice(@current_user)
      flash[:success] = "Success"
    else
      flash[:error] = "Error"
    end
    redirect_to game_path(@game)
  end

  def end_turn
    @game = Game.find(params[:id])
    if @game.end_turn(@current_user)
      flash[:success] = "Success"
    else
      flash[:error] = "Error"
    end
    redirect_to game_path(@game)
  end
end
