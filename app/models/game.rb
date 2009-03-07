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
  has_many :players, :order => "position"
  has_one :map

  validates_length_of :players, :in => 3..4, :if => :first_settlement?
  validates_presence_of :map, :if => :first_settlement?

  delegate :hexes, :nodes, :edges, :to => :map, :prefix => true

  include AASM
  aasm_state :waiting_for_players
  aasm_state :first_settlement
  aasm_state :first_road
  aasm_state :second_settlement
  aasm_state :second_road
  aasm_state :before_roll
  aasm_state :after_roll
  aasm_state :ended

  aasm_event :start do
    transitions :from => :waiting_for_players, :to => :first_settlement
  end

  aasm_event :end_turn do
    transitions :from => :first_settlement, :to => :first_road
    transitions :from => :first_road, :to => :first_settlement, :guard => :next_player?, :on_transition => :next_player
    transitions :from => :first_road, :to => :second_settlement
    transitions :from => :second_settlement, :to => :second_road
    transitions :from => :second_road, :to => :second_settlement, :guard => :previous_player?, :on_transition => :previous_player
    transitions :from => :second_road, :to => :before_roll
    transitions :from => :before_roll, :to => :ended, :guard => :end_of_game?
    transitions :from => :before_roll, :to => :after_roll
    transitions :from => :after_roll, :to => :ended, :guard => :end_of_game?
    transitions :from => :after_roll, :to => :before_roll, :on_transition => :next_player
  end

  aasm_initial_state :waiting_for_players

  def current_player_number
    self[:current_player_number] or 1
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
end
