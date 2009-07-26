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

class Card::Monopoly < Card
  validates_inclusion_of :resource_type, :in => ["bricks", "grain", "lumber", "ore", "wool"], :if => :graveyard?

  delegate :card_played!, :to => :game, :prefix => true
  before_update :rob_resources
  after_update :card_played

  protected

  def rob_resources
    return unless graveyard?
    self[resource_type] = 0
    game_players.each do |player|
      next if player == self.player
      self[resource_type] += player[resource_type]
      player[resource_type] = 0
      player.save
    end
    player[resource_type] += self[resource_type]
  end

  def card_played
    return unless graveyard?
    game_card_played!(user, self)
  end
end
