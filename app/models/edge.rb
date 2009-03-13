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

class Edge < ActiveRecord::Base
  validates_presence_of :player, :map
  validates_associated :player
  validates_uniqueness_of :map_id, :scope => [:x, :y]
  validates_numericality_of :x, :y, :greater_than_or_equal_to => 0, :only_integer => true

  belongs_to :map
  belongs_to :player

  after_save :save_player

  delegate :game, :to => :map
  delegate :width, :height, :size, :nodes, :edges, :hexes, :to => :map, :prefix => true
  delegate :first_road?, :second_road?, :after_roll?, :current_player, :to => :game, :prefix => true
  delegate :edges, :position, :to => :player, :prefix => true

  before_validation_on_create :build_road
  validate :state_of_game, :proximity_of_land, :position_of_development_road, :position_of_road

  def self.find_by_position(position)
    find(:first, :conditions => { :x => position.first, :y => position.second })
  end

  def self.find_by_positions(positions)
    positions.map { |position| find_by_position(position) }
  end

  def player_number
    player_position
  end

  def position
    [x, y]
  end

  def position=(position)
    self.x, self.y = position
  end

  def hex_positions
    if y % 3 == 0
      [[x, y.div(3) - 1], [x, y.div(3) - 2]]
    elsif y % 3 == 1
      [[x - 1, y.div(3) - 1], [x, y.div(3) - 1]]
    else
      [[x - 1, y.div(3)], [x, y.div(3) - 1]]
    end
  end

  def hexes
    map_hexes.find_by_positions(hex_positions)
  end

  def node_positions
    if y % 3 == 0
      [[x, 2 * y.div(3) - 1], [x + 1, 2 * y.div(3) - 2]]
    elsif y % 3 == 1
      [[x, 2 * y.div(3)], [x, 2 * y.div(3) - 1]]
    else
      [[x, 2 * y.div(3) + 1], [x, 2 * y.div(3)]]
    end
  end

  def nodes
    map_nodes.find_by_positions(node_positions)
  end

  def edge_positions
    if y % 3 == 0
      [[x, y + 1], [x, y - 1], [x + 1, y - 2], [x + 1, y - 1]]
    elsif y % 3 == 1
      [[x - 1, y + 2], [x, y - 2], [x, y - 1], [x, y + 1]]
    else
      [[x, y + 2], [x - 1, y + 1], [x, y - 1], [x, y + 1]]
    end
  end

  def edges
    map_edges.find_by_positions(edge_positions)
  end

  protected

  def save_player
    player.save
  end

  # validations

  def position_settleable?
    hexes.detect { |hex| hex.settleable? if hex } != nil
  end

  def first_road?
    player_edges.count < 1 and game_first_road? and player == game_current_player
  end

  def second_road?
    player_edges.count < 2 and game_second_road? and player == game_current_player
  end

  def development_phase?
    first_road? or second_road?
  end

  def build_phase?
    game_after_roll? and player == game_current_player
  end

  def state_of_game
    errors.add_to_base "you cannot build at the moment" unless development_phase? or build_phase?
  end

  def proximity_of_land
    errors.add :position, "is not settleable" unless position_settleable?
  end

  def has_settlement_without_road?
    nodes.detect { |node| not node.nil? and node.player == player and not node.has_road? } != nil
  end

  def position_of_development_road
    errors.add :position, "is invalid, no settlements without roads in neighbourhood" if development_phase? and not has_settlement_without_road?
  end

  def has_settlement?
    nodes.detect { |node| not node.nil? and node.player == player }
  end

  def has_road?
    edges = self.edges.select { |edge| not edge.nil? and edge.player == player }
    nodes = self.nodes.select { |node| not node.nil? and node.player != player }
    edges_to_remove = nodes.map(&:edges).flatten
    edges -= edges_to_remove
    !edges.empty?
  end

  def position_of_road
    errors.add :position, "is invalid, no roads nor settlements in neighbourhood" if build_phase? and not has_settlement? and not has_road?
  end

  # before validation

  def build_road
    player.roads -= 1
    charge_for_road if game_after_roll?
  end

  def charge_for_road
    player.bricks -= 1
    player.lumber -= 1
  end
end
