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
  delegate :edges, :to => :player, :prefix => true

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
end
