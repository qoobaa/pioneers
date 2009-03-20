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
  belongs_to :game
  belongs_to :user
  has_many :nodes
  has_many :edges
  acts_as_list :scope => :game, :column => "number"

  validates_numericality_of :bricks, :grain, :ore, :wool, :lumber, :settlements, :cities, :roads, :points, :greater_than_or_equal_to => 0, :only_integer => true, :allow_nil => true
  validates_uniqueness_of :user_id, :scope => [:game_id]

  before_save :sum_resources
  before_destroy :game_preparing?

  delegate :login, :to => :user, :prefix => true
  delegate :preparing?, :start, :to => :game, :prefix => true

  state_machine :initial => :preparing do
    event :start do
      transition :preparing => :ready
    end

    after_transition :on => :start, :do => lambda { |player| player.game_start }
  end

  def event=(event)
    self.start if event == "start"
  end

  protected

  def sum_resources
    return if bricks.nil? or lumber.nil? or ore.nil? or grain.nil? or wool.nil?
    self.resources = bricks + lumber + ore + grain + wool
  end
end
