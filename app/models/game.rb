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

class Game < ActiveRecord::Base
  has_many :players, :order => "number"
  has_one :map

  validates_length_of :players, :in => 2..4, :if => :first_settlement?
  validates_presence_of :map, :if => :first_settlement?

  delegate :hexes, :nodes, :edges, :height, :width, :size, :hexes_groupped, :edges_groupped, :nodes_groupped, :to => :map, :prefix => true

  after_update :save_players

  state_machine :initial => :waiting_for_players do
    event :start do
      transition :waiting_for_players => :first_settlement
    end

    event :end do
      transition :first_settlement => :first_road
      transition :first_road => :first_settlement, :if => :next_player?
      transition :first_road => :second_settlement
      transition :second_settlement => :second_road
      transition :second_road => :second_settlement, :if => :previous_player?
      transition :second_road => :before_roll
      transition [:before_roll, :after_roll] => :ended, :if => :end_of_game?
      transition :before_roll => :robber, :if => :robber_rolled?
      transition [:before_roll, :robber] => :after_roll
      transition :after_roll => :before_roll
    end
  end

  def current_player_number
    self[:current_player_number] or 1
  end

  def current_turn
    self[:current_turn] or 1
  end

  def current_player
    players[current_player_number - 1]
  end

  def next_player?
    current_player_number < players.count
  end

  def next_player
    self.current_player_number = current_player_number + 1
    self.current_player_number = 1 if current_player_number > players.count
  end

  def previous_player?
    current_player_number != 1
  end

  def previous_player
    self.current_player_number = current_player_number - 1
    self.current_player_number = players.count if current_player_number == 0
  end

  def winner
    players.find(:first, :conditions => "players.points >= 10")
  end

  def end_of_game?
    !winner.nil?
  end

  def roll_dice
    self.current_roll = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].rand
    map_hexes.roll(current_roll).each(&:rolled)
  end

  def robber_rolled?
    self.current_roll == 7
  end

  def next_turn
    self.current_turn += 1
    next_player
  end

  def deal_resources
    players.each do |player|
      player.bricks = player.lumber = player.ore = player.grain = player.wool = 0
      player.settlements = 5
      player.cities = 5
      player.roads = 15
      player.points = 0
    end
  end

  def save_players
    players.each do |player|
      player.save
    end
  end
end
