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
  validates_uniqueness_of :map_id, :scope => [:x, :y]
  validates_numericality_of :x, :y, :greater_than_or_equal_to => 0, :only_integer => true
  validate :proximity_of_land, :proximity_of_settlements, :first_settlement, :second_settlement, :state_of_game_for_settlement, :state_of_game_for_city, :possesion_of_road

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
  delegate :nodes, :to => :player, :prefix => true

  def self.find_by_position(position)
    find(:first, :conditions => { :x => position.first, :y => position.second })
  end

  def self.find_by_positions(positions)
    positions.map { |position| find_by_position(position) }
  end

  def position
    [x, y]
  end

  def position=(position)
    self.x, self.y = position
  end

  def hex_positions
    if y.odd?
      [[x - 1, y.div(2)], [x, y.div(2) - 1], [x, y.div(2)]]
    else
      [[x - 1, y.div(2)], [x - 1, y.div(2) - 1], [x, y.div(2) - 1]]
    end
  end

  def hexes
    map_hexes.find_by_positions(hex_positions)
  end

  def node_positions
    if y.odd?
      [[x, y + 1], [x, y - 1], [x + 1, y - 1]]
    else
      [[x - 1, y + 1], [x, y - 1], [x, y + 1]]
    end
  end

  def nodes
    map_nodes.find_by_positions(node_positions)
  end

  def edge_positions
    if y.odd?
      [[x, 3 * (y.div(2) + 1) + 1], [x, 3 * (y.div(2) + 1) - 1], [x, 3 * (y.div(2) + 1)]]
    else
      [[x - 1, 3 * y.div(2) + 3], [x, 3 * y.div(2) + 1], [x, 3 * y.div(2) + 2]]
    end
  end

  def edges
    map_edges.find_by_positions(edge_positions)
  end

  def add_resources(type)
    return if type.nil?
    player[type] += 1 if settlement?
    player[type] += 2 if city?
  end

  def has_road?
    edges.detect { |edge| not edge.nil? and edge.player == player } != nil
  end

  protected

  def save_player
    player.save
  end

  def first_settlement?
    return if player.nil?
    player_nodes.settlement.count < 1
  end

  def second_settlement?
    return if player.nil?
    player_nodes.settlement.count < 2
  end

  def game_settlement_build_phase?
    game_first_settlement? or game_second_settlement? or game_after_roll?
  end

  def state_of_game_for_settlement
    return unless settlement?
    errors.add_to_base "you cannot build settlement at the moment" unless game_settlement_build_phase? and game_current_player == player
  end

  def possesion_of_road
    return unless game_after_roll?
    errors.add :position, "has no road" unless has_road?
  end

  def game_city_build_phase?
    game_after_roll?
  end

  def state_of_game_for_city
    return unless city?
    errors.add_to_base "you cannot build city at the moment" unless game_city_build_phase? and game_current_player == player
  end

  def first_settlement
    errors.add_to_base "you have already built the first settlement" if game_first_settlement? and not first_settlement?
  end

  def second_settlement
    errors.add_to_base "you have already built the second settlement" if game_second_settlement? and not second_settlement?
  end

  def position_settleable?
    hexes.detect { |hex| hex.settleable? if hex } != nil
  end

  def proximity_of_land
    errors.add :position, "is not settleable" unless position_settleable?
  end

  def proximity_of_settlements
    errors.add :position, "is too close to another settlement" unless nodes.compact.empty?
  end

  def build_settlement
    return if player.nil?
    player.settlements -= 1
    add_resources_from_neighbours if game_second_settlement?
    charge_for_settlement if game_after_roll?
    add_victory_point
  end

  def build_city
    return if player.nil?
    player.settlements += 1
    player.cities -= 1
    charge_for_city
    add_victory_point
  end

  def add_resources_from_neighbours
    hexes.compact.each { |hex| add_resources(hex.resource_type) }
  end

  def charge_for_settlement
    player.lumber -= 1
    player.grain -= 1
    player.wool -= 1
    player.bricks -= 1
  end

  def charge_for_city
    player.ore -= 3
    player.grain -= 2
  end

  def add_victory_point
    player.points += 1
  end
end
