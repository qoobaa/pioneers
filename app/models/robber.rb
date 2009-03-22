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

class Robber < ActiveRecord::Base
  belongs_to :map

  validates_numericality_of :row, :col, :only_integer => true
  validate :already_moved, :position_settleable, :phase_of_game

  before_update :set_moved

  delegate :game, :to => :map
  delegate :hexes, :to => :map, :prefix => true
  delegate :phase_robber_move?, :current_player, :id, :to => :game, :prefix => true

  attr_accessor :current_user

  def position_was
    [row_was, col_was]
  end

  def position
    [row, col]
  end

  def position=(position)
    self.row, self.col = position
  end

  def hex
    map_hexes.find_by_position(position)
  end

  def current_user_player
    current_user.players.find_by_game_id(game_id) if current_user
  end

  protected

  def position_changed?
    position != position_was
  end

  def set_moved
    self.moved = position_changed?
  end

  def already_moved
    errors.add_to_base "has been already moved" if moved?
  end

  def position_settleable
    errors.add :position, "hex is not settleable" unless hex and hex.settleable?
  end

  def phase_of_game
    errors.add_to_base "you cannot move robber at the moment" unless game_phase_robber_move? and current_user_player == game_current_player
  end
end
