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

class EdgesController < ApplicationController
  before_filter :require_user, :fetch_game

  def create
    @edge = @game.board_edges.build(params[:edge])
    @edge.user = @current_user
    if true # @edge.save
      edge = @edge.to_hash(:position => :position, :player => :player_number)
      game = @game.to_hash(:state => :state, :winner => :winner_number)
      player = @edge.player.to_hash(:number => :number, :resources => :resources, :points => :visible_points)
      stomp_send(@game, { :event => "roadBuilt", :edge => edge, :game => game, :player => player })
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
