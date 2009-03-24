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

class DiceRoll < ActiveRecord::Base
  belongs_to :game

  validates_uniqueness_of :turn, :scope => :game_id

  before_validation :roll_dice, :set_turn
  after_create :dice_rolled

  delegate :dice_rolled!, :current_turn, :to => :game, :prefix => true

  attr_accessor :user

  def robber?
    value == 7
  end

  protected

  def roll_dice
    self.value = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].rand
  end

  def set_turn
    self.turn = game_current_turn
  end

  def dice_rolled
    game_dice_rolled!(user)
  end
end