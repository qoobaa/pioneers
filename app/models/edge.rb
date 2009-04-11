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
  validates_presence_of :player, :board
  validates_associated :player
  validates_uniqueness_of :board_id, :scope => [:row, :col]

  belongs_to :board
  belongs_to :player

  after_save :save_player, :road_built

  delegate :game, :to => :board
  delegate :width, :height, :size, :nodes, :edges, :hexes, :to => :board, :prefix => true
  delegate :players, :first_road?, :second_road?, :after_roll?, :road_built!, :to => :game, :prefix => true
  delegate :edges, :number, :to => :player, :prefix => true

  before_validation_on_create :build_road
  validate :proximity_of_land, :position_of_development_road, :position_of_road

  attr_reader :user

  def user=(user)
    @user = user
    self.player = game_players.find_by_user_id(user.id)
  end

  def self.find_by_position(position)
    find(:first, :conditions => { :row => position.first, :col => position.second })
  end

  def self.find_by_positions(positions)
    #positions.map { |position| find_by_position(position) }.compact
    find(:all, :conditions => [%Q{(row = ? AND col = ?) OR } * positions.size + %Q{ 0 = 1}, *positions.flatten])
  end

  def position
    [row, col]
  end

  def position=(position)
    self.row, self.col = position
  end

  def hex_positions
    if col % 3 == 0
      [[row, col.div(3) - 1], [row, col.div(3) - 2]]
    elsif col % 3 == 1
      [[row - 1, col.div(3) - 1], [row, col.div(3) - 1]]
    else
      [[row - 1, col.div(3)], [row, col.div(3) - 1]]
    end
  end

  def hexes
    board_hexes.find_by_positions(hex_positions)
  end

  def node_positions
    [left_node_position, right_node_position]
  end

  def right_node_position
    if col % 3 == 0
      [row, 2 * col.div(3) - 1]
    elsif col % 3 == 1
      [row, 2 * col.div(3)]
    else
      [row, 2 * col.div(3) + 1]
    end
  end

  def left_node_position
    if col % 3 == 0
      [row + 1, 2 * col.div(3) - 2]
    elsif col % 3 == 1
      [row, 2 * col.div(3) - 1]
    else
      [row, 2 * col.div(3)]
    end
  end

  def left_node
    board_nodes.find_by_position(left_node_position)
  end

  def right_node
    board_nodes.find_by_position(right_node_position)
  end

  def nodes
    board_nodes.find_by_positions(node_positions)
  end

  def edge_positions
    left_edge_positions + right_edge_positions
  end

  def left_edge_positions
    if col % 3 == 0
      [[row + 1, col - 2], [row + 1, col - 1]]
    elsif col % 3 == 1
      [[row, col - 2], [row, col - 1]]
    else
      [[row - 1, col + 1], [row, col - 1]]
    end
  end

  def right_edge_positions
    if col % 3 == 0
      [[row, col + 1], [row, col - 1]]
    elsif col % 3 == 1
      [[row - 1, col + 2], [row, col + 1]]
    else
      [[row, col + 2], [row, col + 1]]
    end
  end

  def edges
    board_edges.find_by_positions(edge_positions)
  end

  def left_edges
    board_edges.find_by_positions(left_edge_positions)
  end

  def right_edges
    board_edges.find_by_positions(right_edge_positions)
  end

  def left_roads
    if left_node.nil? or left_node.player == player
      left_edges.select { |edge| edge.player == player }
    else
      []
    end
  end

  def right_roads
    if right_node.nil? or right_node.player == player
      right_edges.select { |edge| edge.player == player }
    else
      []
    end
  end

  def roads
    left_roads + right_roads
  end

  def longest_road(visited_roads = [], skip_roads = [])
    visited_roads << self

    # left roads
    unvisited_left_roads = left_roads - visited_roads - skip_roads
    left_road_lenghts = unvisited_left_roads.map do |road|
      lenghts, new_visited_roads = road.longest_road(visited_roads, unvisited_left_roads)
      visited_roads = (visited_roads + new_visited_roads).uniq
      lenghts
    end

    # right roads
    unvisited_right_roads = right_roads - visited_roads - skip_roads
    right_road_lenghts = unvisited_right_roads.map do |road|
      lenghts, new_visited_roads = road.longest_road(visited_roads, unvisited_right_roads)
      visited_roads = (visited_roads + new_visited_roads).uniq
      lenghts
    end

    longest_road = 1 + (left_road_lenghts.max or 0) + (right_road_lenghts.max or 0)
    return [longest_road, visited_roads]
  end

  protected

  def save_player
    player.save
  end

  # validations

  def position_settleable?
    hexes.detect { |hex| hex.settleable? if hex } != nil
  end

  def setup_phase?
    game_first_road? or game_second_road?
  end

  def proximity_of_land
    errors.add :position, "is not settleable" unless position_settleable?
  end

  def has_settlement_without_road?
    nodes.detect { |node| not node.nil? and node.player == player and not node.has_road? } != nil
  end

  def position_of_development_road
    errors.add :position, "is invalid, no settlements without roads in neighbourhood" if setup_phase? and not has_settlement_without_road?
  end

  def has_settlement?
    nodes.detect { |node| not node.nil? and node.player == player }
  end

  def has_road?
    !roads.empty?
  end

  def position_of_road
    errors.add :position, "is invalid, no roads nor settlements in neighbourhood" if game_after_roll? and not has_settlement? and not has_road?
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

  def road_built
    game_road_built!(user)
  end
end
