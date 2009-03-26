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

  validates_uniqueness_of :user_id, :scope => [:game_id]

  delegate :login, :to => :user, :prefix => true
  delegate :start_game, :preparing?, :to => :game, :prefix => true
  validates_numericality_of :bricks, :grain, :ore, :wool, :lumber, :settlements, :cities, :roads, :points,
                            :discard_lumber, :discard_grain, :discard_ore, :discard_wool, :discard_bricks,
                            :greater_than_or_equal_to => 0, :only_integer => true, :allow_nil => true

  before_destroy :game_preparing?

  attr_accessor :discard_lumber, :discard_grain, :discard_ore, :discard_wool, :discard_bricks, :event

  state_machine :initial => :preparing do
    event :start do
      transition :preparing => :ready
    end

    event :play do
      transition :ready => :playing
    end

    after_transition :on => :start do |player|
      player.game_start_game
    end
  end

  def rob_resource
    ([:bricks] * bricks + [:lumber] * lumber + [:ore] * ore + [:grain] * grain + [:wool] * wool).rand
  end

  protected

  def sum_resources
    self.resources = bricks + lumber + ore + grain + wool
  end

  def discarding?
    discard_lumber or discard_grain or discard_ore or discard_wool or discard_bricks
  end

  def discard_resources
    self.lumber -= (discard_lumber or 0)
    self.grain -= (discard_grain or 0)
    self.ore -= (discard_ore or 0)
    self.wool -= (discard_wool or 0)
    self.bricks -= (discard_bricks or 0)
  end

  def phase_of_game
    errors.add_to_base "you cannot discard resources at the moment" if discarding? and not game_discard_robber(self)
  end

  def discard_lumber_before_type_cast
    discard_lumber
  end

  def discard_grain_before_type_cast
    discard_grain
  end

  def discard_ore_before_type_cast
    discard_ore
  end

  def discard_wool_before_type_cast
    discard_wool
  end

  def discard_bricks_before_type_cast
    discard_bricks
  end
end
