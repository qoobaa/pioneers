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

class Hex < ActiveRecord::Base
  belongs_to :map
  delegate :width, :height, :size, :robber_position, :nodes, :edges, :hexes, :to => :map, :prefix => true
  delegate :game, :to => :map

  validates_inclusion_of :roll, :in => [2, 3, 4, 5, 6, 8, 9, 10, 11, 12], :allow_nil => true
  validates_uniqueness_of :map_id, :scope => [:row, :col]
  validates_numericality_of :row, :col, :greater_than_or_equal_to => 0, :only_integer => true

  extend EnumField
  enum_field :hex_type, ["hill", "field", "mountain", "pasture", "forest", "sea", "desert"]

  named_scope :roll, lambda { |roll| { :conditions => { :roll => roll } } }

  RESOURCE_TYPES = { "hill" => "bricks", "field" => "grain", "mountain" => "ore", "pasture" => "wool", "forest" => "lumber" }.freeze

  def robber?
    map_robber_position == position
  end

  def position
    [row, col]
  end

  def position=(position)
    self.row, self.col = position
  end

  def settleable?
    not sea?
  end

  def self.find_by_position(position)
    find(:first, :conditions => { :row => position.first, :col => position.second })
  end

  def self.find_by_positions(positions)
    positions.map { |position| find_by_position(position) }
  end

  def resource_type
    RESOURCE_TYPES[hex_type]
  end

  def rolled
    nodes.each { |node| node.add_resources(resource_type) unless node.nil? } unless robber?
  end

  def hex_positions
    [[row - 1, col + 1], [row - 1, col], [row, col - 1], [row + 1, col - 1], [row + 1, col], [row, col + 1]]
  end

  def hexes
    map_hexes.find_by_positions(hex_positions)
  end

  def node_positions
    [[row, 2 * col + 3], [row, 2 * col + 2], [row, 2 * col + 1], [row + 1, 2 * col], [row + 1, 2 * col + 1], [row + 1, 2 * col + 2]]
  end

  def nodes
    map_nodes.find_by_positions(node_positions)
  end

  def edge_positions
    [[row, 3 * col + 5], [row, 3 * col + 4], [row, 3 * col + 3], [row + 1, 3 * col + 2], [row + 1, 3 * col + 4], [row, 3 * col + 6]]
  end

  def edges
    map_edges.find_by_position(edge_positions)
  end
end
