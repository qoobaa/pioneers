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

class Discard < ActiveRecord::Base
  belongs_to :game
  belongs_to :player

  validates_presence_of :player
  validates_associated :player
  validates_numericality_of :bricks, :grain, :ore, :wool, :lumber, :greater_than_or_equal_to => 0, :only_integer => true, :allow_nil => true

  before_validation :discard
  after_save :save_player, :discarded

  delegate :players, :discarded!, :to => :game, :prefix => true

  attr_reader :user

  def user_player
    game_players.find_by_user_id(user.id)
  end

  def user=(user)
    @user = user
    self.player = user_player
  end

  protected

  def discard
    player.ore -= (ore or 0)
    player.bricks -= (bricks or 0)
    player.grain -= (grain or 0)
    player.wool -= (wool or 0)
    player.lumber -= (lumber or 0)
  end

  def discarded
    game_discarded!(user)
  end

  def save_player
    player.save
  end
end
