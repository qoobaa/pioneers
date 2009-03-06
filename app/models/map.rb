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

class Map < ActiveRecord::Base
  belongs_to :game

  validates_numericality_of :width, :height, :greater_than => 0
  validates_presence_of :hexes_attributes, :on => :create

  has_many :hexes, :dependent => :destroy
  has_many :nodes, :dependent => :destroy
  has_many :edges, :dependent => :destroy

  before_validation_on_create :build_hexes

  attr_accessor :hexes_attributes

  def x_belongs_to_map?(x)
    (0...width).include? x
  end

  def y_belongs_to_map?(y)
    (0...height).include? y
  end

  def position_belongs_to_map?(position)
    x_belongs_to_map?(position[0]) and y_belongs_to_map?(position[1])
  end

  def size
    [width, height]
  end

  def size=(size)
    self.width, self.height = size
  end

  def robber_position
    [robber_y, robber_y]
  end

  def robber_position=(robber_position)
    self.robber_x, self.robber_y = robber_position
  end

  protected

  def build_hexes
    return if hexes_attributes.blank?
    hexes.clear
    hexes_attributes.each_with_index do |attributes, i|
      hexes.build(attributes.merge(:position => i.divmod(width))) unless attributes.nil?
    end
  end
end

