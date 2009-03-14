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

class Node < ActiveRecord::Base
  include AASM
  aasm_state :settlement

  aasm_state :city
  aasm_initial_state :settlement

  validates_presence_of :player, :map
  validates_associated :player
  validates_uniqueness_of :map_id, :scope => [:row, :col]
  validates_numericality_of :row, :col, :greater_than_or_equal_to => 0, :only_integer => true
  validate :proximity_of_land, :proximity_of_settlements, :state_of_game, :possesion_of_road

  aasm_event :expand do
    transitions :from => :settlement, :to => :city, :on_transition => :build_city
  end

  belongs_to :map
  belongs_to :player

  before_validation_on_create :build_settlement
  after_save :save_player

  delegate :game, :to => :map
  delegate :width, :height, :size, :nodes, :edges, :hexes, :to => :map, :prefix => true
  delegate :players, :first_settlement?, :second_settlement?, :after_roll?, :current_player, :to => :game, :prefix => true
  delegate :nodes, :number, :to => :player, :prefix => true

  def self.find_by_position(position)
    find(:first, :conditions => { :row => position.first, :col => position.second })
  end

  def self.find_by_positions(positions)
    positions.map { |position| find_by_position(position) }
  end

  def position
    [row, col]
  end

  def position=(position)
    self.row, self.col = position
  end

  def hex_positions
    if col.odd?
      [[row - 1, col.div(2)], [row, col.div(2) - 1], [row, col.div(2)]]
    else
      [[row - 1, col.div(2)], [row - 1, col.div(2) - 1], [row, col.div(2) - 1]]
    end
  end

  def hexes
    map_hexes.find_by_positions(hex_positions)
  end

  def node_positions
    if col.odd?
      [[row, col + 1], [row, col - 1], [row + 1, col - 1]]
    else
      [[row - 1, col + 1], [row, col - 1], [row, col + 1]]
    end
  end

  def nodes
    map_nodes.find_by_positions(node_positions)
  end

  def edge_positions
    if position[1].odd?
      [[row, 3 * (col.div(2) + 1) + 1], [row, 3 * (col.div(2) + 1) - 1], [row, 3 * (col.div(2) + 1)]]
    else
      [[row - 1, 3 * col.div(2) + 3], [row, 3 * col.div(2) + 1], [row, 3 * col.div(2) + 2]]
    end
  end

  def edges
    map_edges.find_by_positions(edge_positions)
  end

  def add_resources(type)
    return if type.nil?
    player[type] += 1 if settlement?
    player[type] += 2 if city?
    player.save
  end

  def has_road?
    edges.detect { |edge| not edge.nil? and edge.player == player } != nil
  end

  protected

  def add_resources_from_neighbours
    hexes.compact.each { |hex| add_resources(hex.resource_type) }
  end

  def add_victory_point
    player.points += 1
  end

  def save_player
    player.save
  end

  # validations

  def position_settleable?
    hexes.detect { |hex| hex.settleable? if hex } != nil
  end

  def first_settlement?
    player_nodes.settlement.count < 1 and game_first_settlement? and player == game_current_player
  end

  def second_settlement?
    player_nodes.settlement.count < 2 and game_second_settlement? and player == game_current_player
  end

  def development_phase?
    first_settlement? or second_settlement?
  end

  def build_phase?
    game_after_roll? and player == game_current_player
  end

  def state_of_game
    errors.add_to_base "you cannot build at the moment" unless development_phase? or build_phase?
  end

  def possesion_of_road
    errors.add :position, "has no road" unless development_phase? or has_road?
  end

  def proximity_of_land
    errors.add :position, "is not settleable" unless position_settleable?
  end

  def proximity_of_settlements
    errors.add :position, "is too close to another settlement" unless nodes.compact.empty?
  end

  # settlement - before validation

  def build_settlement
    player.settlements -= 1
    add_resources_from_neighbours if game_second_settlement?
    charge_for_settlement if game_after_roll?
    add_victory_point
  end

  def charge_for_settlement
    player.lumber -= 1
    player.grain -= 1
    player.wool -= 1
    player.bricks -= 1
  end

  # city - before validation (on transition)

  def build_city
    player.settlements += 1
    player.cities -= 1
    charge_for_city
    add_victory_point
  end

  def charge_for_city
    player.ore -= 3
    player.grain -= 2
  end
end
