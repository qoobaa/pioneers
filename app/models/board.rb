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

class Board < ActiveRecord::Base
  extend ActiveSupport::Memoizable
  include ToHash

  belongs_to :game

  validates_numericality_of :width, :height, :greater_than => 0, :only_integer => true
  validates_numericality_of :robber_row, :robber_col, :only_integer => true
  validates_presence_of :hexes_attributes, :on => :create

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

  def hexes_groupped
    (0..10).map do |row|
      (0..10).map do |col|
        hexes.detect { |hex| hex.row == row and hex.col == col }
      end
    end
  end
  memoize :hexes_groupped

  def nodes_groupped
    (0..10).map do |row|
      (0..22).map do |col|
        nodes.detect { |node| node.row == row and node.col == col }
      end
    end
  end
  memoize :nodes_groupped

  def edges_groupped
    (0..10).map do |row|
      (0..29).map do |col|
        edges.detect { |edge| edge.row == row and edge.col == col }
      end
    end
  end
  memoize :edges_groupped

  def robber_position
    [robber_row, robber_col]
  end

  def robber_position=(position)
    self.robber_row, self.robber_col = position
  end

  protected

  def build_hexes
    return if hexes_attributes.blank?
    hexes.clear
#     hexes_attributes.each_with_index do |attributes, i|
#       hexes.build(attributes.merge(:position => i.divmod(width))) unless attributes.nil?
#     end
    hexes_attributes.each { |attributes| hexes.build(attributes) }
  end
end

