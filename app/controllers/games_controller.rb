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
    current_user # fetch user
    respond_to do |format|
      format.html do
        @game = Game.find(params[:id], include: { map: [:hexes, :nodes, :edges], players: [:user] })
      end
      format.json do
        @game = Game.find(params[:id], include: { map: [:nodes, :edges], players: [:user] })
        nodes = @game.map_nodes.map do |node|
          { position: node.position,
            player_id: node.player_id,
            state: node.state }
        end
        edges = @game.map_edges.map do |edge|
          { position: edge.position,
            player_id: edge.player_id }
        end
        players = @game.players.map do |player|
          { id: player.id,
            number: player.number,
            points: player.visible_points,
            resources: player.resources,
            name: player.user_login,
            idle_time: player.idle_time }
        end
        game = {
          nodes: nodes,
          edges: edges,
          players: players,
          state: @game.state,
          phase: @game.phase,
          robber_position: @game.map_robber_position,
          map_size: @game.map_size,
          current_turn: @game.current_turn,
          current_turn_card_played: @game.current_turn_card_played,
          current_player_id: @game.current_player_id,
          cards: @game.cards_count
        }
        render :json => { game: game }
      end
    end
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
