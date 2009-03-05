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

class Player < ActiveRecord::Base
  validates_numericality_of :bricks, :grain, :ore, :wool, :lumber, :settlements, :cities, :roads, :greater_than_or_equal_to => 0
  belongs_to :game
  has_many :nodes
  has_many :edges
  acts_as_list :scope => :game

  def bricks
    self[:bricks] or 0
  end

  def grain
    self[:grain] or 0
  end

  def ore
    self[:ore] or 0
  end

  def wool
    self[:wool] or 0
  end

  def lumber
    self[:lumber] or 0
  end

  def settlements
    self[:settlements] or 0
  end

  def cities
    self[:cities] or 0
  end

  def roads
    self[:roads] or 0
  end

  def points
    self[:points] or 0
  end
end
