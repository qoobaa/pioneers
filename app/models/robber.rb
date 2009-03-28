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
  validate :position_settleable, :position_changed, :player_in_neighbourhood

  delegate :game, :to => :map
  delegate :hexes, :to => :map, :prefix => true
  delegate :robbed!, :players, :to => :game, :prefix => true

  after_update :rob_player, :robbed

  attr_accessor :user, :player_number

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

  def players
    hex.nodes.compact.map(&:player)
  end

  def player
    game_players.find_by_number(@player_number)
  end

  def user_player
    game_players.find_by_user_id(user.id)
  end

  protected

  def position_changed?
    position != position_was
  end

  def position_settleable
    return if new_record?
    errors.add :position, "hex is not settleable" unless hex and hex.settleable?
  end

  def position_changed
    return if new_record?
    errors.add :position, "must be changed" unless position_changed?
  end

  def robbed
    game_robbed!(user)
  end

  def player_in_neighbourhood
    return if player_number.blank?
    errors.add :player, "must be in neighbourhood" unless players.include? player
  end

  def rob_player
    return unless player
    robbed_player = self.player
    robbing_player = self.user_player
    type = robbed_player.rob_resource
    if type
      robbed_player[type] -= 1
      robbing_player[type] += 1
    end
    robbed_player.save
    robbing_player.save
  end
end
