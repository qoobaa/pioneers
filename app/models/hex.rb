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
  delegate :width, :height, :size, :robber_position, :to => :map, :prefix => true
  delegate :game, :to => :map

  validates_inclusion_of :roll, :in => [2, 3, 4, 5, 6, 8, 9, 10, 11, 12], :allow_nil => true

  extend EnumField
  enum_field :hex_type, ["hill", "field", "mountain", "pasture", "forest", "sea"]

  RESOURCE_TYPES = { "hill"     => "bricks",
                     "field"    => "grain",
                     "mountain" => "ore",
                     "pasture"  => "wool",
                     "forest"   => "lumber" }.freeze

  def robber?
    map_robber_position == position
  end

  def position
    [x, y]
  end

  def position=(position)
    self.x, self.y = position
  end

  def settleable?
    not sea?
  end

  def self.find_by_position(position)
    find(:first, :conditions => { :x => position.first, :y => position.second })
  end

  def resource_type
    RESOURCE_TYPES[hex_type]
  end

  def rolled
    nodes.each { |node| node.add_resources(resource_type) } unless robber?
  end
end
