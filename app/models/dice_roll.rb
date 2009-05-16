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
  include ToHash

  belongs_to :game
  belongs_to :player

  validates_uniqueness_of :turn, :scope => :game_id

  before_validation :roll_dice, :set_turn
  after_create :dice_rolled

  delegate :players, :dice_rolled!, :current_turn, :to => :game, :prefix => true

  attr_reader :user

  def user=(user)
    @user = user
    self.player = user_player
  end

  def user_player
    game_players.find_by_user_id(user.id)
  end

  def robber?
    value == 7
  end

  protected

  def roll_dice
    self.value = [1, 2, 3, 4, 5, 6].rand + [1, 2, 3, 4, 5, 6].rand
  end

  def set_turn
    self.turn = game_current_turn
  end

  def dice_rolled
    game_dice_rolled!(user)
  end
end
