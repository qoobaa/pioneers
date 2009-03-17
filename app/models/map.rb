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
  # validates_numericality_of :robber_row, :robber_col, :only_integer => true

  has_many :hexes, :dependent => :destroy
  has_many :nodes, :dependent => :destroy
  has_many :edges, :dependent => :destroy

  before_validation_on_create :build_hexes

  attr_accessor :hexes_attributes

  def size
    [width, height]
  end

  def size=(size)
    self.width, self.height = size
  end

  def robber_position
    [robber_row, robber_col]
  end

  def robber_position=(robber_position)
    self.robber_row, self.robber_col = robber_position
  end

  def hexes_groupped
    (0...height).map { |row| hexes.find_all_by_row(row) }
  end

  def nodes_groupped
    (0..height).map { |row| nodes.find_all_by_row(row) }
  end

  def edges_groupped
    (0..height).map { |row| edges.find_all_by_row(row) }
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

