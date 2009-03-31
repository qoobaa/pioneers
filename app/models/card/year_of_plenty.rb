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

class Card::YearOfPlenty < Card
  validates_numericality_of :bricks, :grain, :lumber, :ore, :wool, :only_integer => true, :greater_than_or_equal_to => 0, :allow_nil => true
  validate :two_resources_chosen

  delegate :card_played!, :to => :game, :prefix => true
  before_update :add_resources
  after_update :card_played

  protected

  def resources_sum
    (bricks or 0) + (grain or 0) + (lumber or 0) + (ore or 0) + (wool or 0)
  end

  def two_resources_chosen
    return unless graveyard?
    errors.add_to_base "You have to choose two resources only" if resources_sum != 2
  end

  def add_resources
    return unless graveyard?
    player.bricks += (bricks or 0)
    player.grain += (grain or 0)
    player.lumber += (lumber or 0)
    player.ore += (ore or 0)
    player.wool += (wool or 0)
  end

  def card_played
    return unless graveyard?
    game_card_played!(user)
  end
end
