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

  delegate :hexes, :nodes, :edges, :height, :width, :size, :hexes_groupped, :edges_groupped, :nodes_groupped, :robber, :to => :map, :prefix => true
  delegate :robber, :to => :map
  delegate :moved=, :moved?, :to => :robber, :prefix => true

  after_update :save_players, :end

  state_machine :initial => :preparing do
    event :start do
      transition :preparing => :playing
    end

    event :end do
      transition :playing => :ended, :if => :end_of_game?
    end

    state :playing do
#       validates_length_of :players, :in => 2..4
#       validates_presence_of :map
#       validate :players_ready
    end

    after_transition :on => :start, :do => :deal_resources
  end

  state_machine :phase, :namespace => :phase, :initial => :first_settlement do
    event :end do
      transition :first_settlement => :first_road
      transition :first_road => :first_settlement, :if => :next_player?
      transition :first_road => :second_settlement
      transition :second_settlement => :second_road
      transition :second_road => :second_settlement, :if => :previous_player?
      transition :second_road => :before_roll
      transition :before_roll => :robber, :if => :robber_rolled?
      transition :before_roll => :after_roll
      transition :robber => :after_roll, :if => :robber_ended?
      transition :after_roll => :before_roll
    end

    before_transition :on => :end, :do => lambda { |game, transition| game.event_authorized?(*transition.args) }
    before_transition :before_roll => all, :do => :replace_current_roll
    before_transition :before_roll => :robber, :do => lambda { |game| game.reset_robber }
    before_transition :before_roll => :after_roll, :do => :add_resources
    before_transition :first_road => :first_settlement, :do => :next_player
    before_transition :second_road => :second_settlement, :do => :previous_player
    before_transition :after_roll => :before_roll, :do => :next_turn
  end

  state_machine :robber_phase, :namespace => :robber, :initial => :ended do
    event :reset do
      transition :ended => :discarding, :if => :next_player_to_rob?
      transition :ended => :moving
    end

    event :discard do
      transition :discarding => :discarding, :if => :next_player_to_rob?
      transition :discarding => :moving
    end

    event :move do
      transition :moving => :robbing
    end

    event :rob do
      transition :robbing => :ended
    end

    before_transition :on => :discard, :do => lambda { |game, transition| game.player_robbed?(*transition.args) }
    before_transition all - :ended => all, :do => :phase_robber?
    before_transition :discarding => :moving, :do => :reset_robber_player_number
    before_transition all => :discarding, :do => :rob_next_player
  end

  def current_player_number
    self[:current_player_number] or 1
  end

  def event_authorized?(user)
    user.players.find_by_game_id(id) == current_player
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

  def robber_player
    players[robber_player_number - 1]
  end

  def next_player_to_rob?
    players.exists?([%Q(resources > 7 and number > ?), robber_player_number])
  end

  def rob_next_player
    player = players.find(:first, :conditions => [%Q(resources > 7 and number > ?), robber_player_number])
    self.robber_player_number = player.number
    self.robber_resource_limit = (player.resources + 1).div(2)
  end

  def reset_robber_player_number
    self.robber_player_number = 0
  end

  def player_robbed?(player)
    player == robber_player and player.resources == robber_resource_limit
  end

  def winner
    players.find(:first, :conditions => "players.points >= 10")
  end

  def end_of_game?
    !winner.nil?
  end

  def roll_dice
    @roll ||= 7#[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].rand
  end

  def replace_current_roll
    self.current_roll = @roll
  end

  def add_resources
    map_hexes.roll(current_roll).each(&:rolled)
  end

  def robber_rolled?
    roll_dice == 7
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

  def play_players
    players.each do |player|
      player.play
    end
  end

  def save_players
    players.each(&:save)
  end

  def players_ready
    players.each do |player|
      errors.add :players, "are not ready" unless player.ready?
    end
  end
end
