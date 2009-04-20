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
        nodes = @game.board_nodes.map do |node|
          { position: node.position,
            playerNumber: node.player_number,
            state: node.state,
            id: node.id }
        end
        edges = @game.board_edges.map do |edge|
          { position: edge.position,
            playerNumber: edge.player_number }
        end
        players = @game.players.map do |player|
          { id: player.id,
            number: player.number,
            points: player.visible_points,
            resources: player.resources,
            name: player.user_login,
            isUserIdle: player.user_idle? }
        end
        hexes = @game.board_hexes.map do |hex|
          { roll: hex.roll,
            type: hex.hex_type,
            position: hex.position,
            harborPosition: hex.harbor_position,
            harborType: hex.harbor_type }
        end
        if @user_player
          cards = @user_player.cards.map do |card|
            { id: card.id,
              type: card.type,
              state: card.state }
          end
          user_player = {
            id: @user_player.id,
            number: @user_player.number,
            bricks: @user_player.bricks,
            grain: @user_player.grain,
            lumber: @user_player.lumber,
            ore: @user_player.ore,
            wool: @user_player.wool,
            settlements: @user_player.settlements,
            cities: @user_player.cities,
            roads: @user_player.roads,
            state: @user_player.state,
            visiblePoints: @user_player.visible_points,
            hiddenPoints: @user_player.hidden_points,
            bricksExchangeRate: @user_player.bricks_exchange_rate,
            grainExchangeRate: @user_player.grain_exchange_rate,
            lumberExchangeRate: @user_player.lumber_exchange_rate,
            oreExchangeRate: @user_player.ore_exchange_rate,
            woolExchangeRate: @user_player.wool_exchange_rate,
            cards: cards
          }
        end
        game = {
          board: {
            size: @game.board_size,
            hexes: hexes,
            nodes: nodes,
            edges: edges,
            robberPosition: @game.board_robber_position,
          },
          userPlayer: user_player,
          players: players,
          id: @game.id,
          state: @game.state,
          phase: @game.phase,
          currentTurn: @game.current_turn,
          currentTurnCardPlayed: @game.current_turn_card_played,
          currentPlayerId: @game.current_player_id,
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
