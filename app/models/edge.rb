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

  protected

  def save_player
    player.save
  end
end
