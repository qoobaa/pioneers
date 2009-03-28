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
  has_many :dice_rolls, :order => "turn DESC"
  has_many :discards
  has_many :offers
  has_one :map

  delegate :hexes, :nodes, :edges, :height, :width, :size, :hexes_groupped, :edges_groupped, :nodes_groupped, :robber, :to => :map, :prefix => true
  delegate :robber?, :value, :to => :current_dice_roll, :prefix => true
  delegate :resources, :to => :current_discard_player, :prefix => true

  after_update :save_players, :end_game

  state_machine :initial => :preparing do
    event :start_game do
      transition :preparing => :playing
    end

    event :end_game do
      transition :playing => :ended, :if => :winner?
    end

    state :playing do
      validates_length_of :players, :in => 2..4
      validates_presence_of :map
      validate :players_ready
    end

    before_transition :on => :start_game do |game|
      game.reset_robber
      game.deal_resources
      game.current_turn = 1
      game.current_player_number = 1
    end
  end

  state_machine :phase, :initial => :first_settlement do
    before_transition :on => [:settlement_built, :road_built, :dice_rolled, :end_turn, :robbed] do |game, transition|
      game.playing? and game.current_user_turn?(*transition.args)
    end

    before_transition :on => :discarded do |game, transition|
      game.playing? and game.current_user_discard?(*transition.args)
    end

    event :settlement_built do
      transition :first_settlement => :first_road
      transition :second_settlement => :second_road
      transition :after_roll => :after_roll # dummy
    end

    event :road_built do
      transition :first_road => :first_settlement, :if => :next_player?
      transition :first_road => :second_settlement
      transition :second_road => :second_settlement, :if => :previous_player?
      transition :second_road => :before_roll
      transition :road_building_first_road => :road_building_second_road
      transition :road_building_second_road => :after_roll
      transition :after_roll => :after_roll # dummy
    end

    before_transition :first_road => :first_settlement, :do => :next_player
    before_transition :second_road => :second_settlement, :do => :previous_player

    event :dice_rolled do
      transition :before_roll => :discard, :if => lambda { |game| game.current_dice_roll_robber? and game.next_player_to_discard? }
      transition :before_roll => :robber, :if => :current_dice_roll_robber?
      transition :before_roll => :after_roll
    end

    event :discarded do
      transition :discard => :discard, :if => :next_player_to_discard?
      transition :discard => :robber
    end

    before_transition :discard => all, :do => :player_resources_discarded?
    before_transition all => :discard, :do => :next_player_discard
    before_transition :discard => :robber, :do => :reset_robber

    event :robbed do
      transition :robber => :after_roll, :if => :current_dice_roll?
      transition :robber => :before_roll
    end

    event :end_turn do
      transition :after_roll => :before_roll
    end

    before_transition :on => :end_turn, :do => :next_turn

    event :play_army_card do
      transition [:before_roll, :after_roll] => :robber
    end

    event :play_road_building_card do
      transition :after_roll => :road_building_first_road
    end

    event :road_building_first_road_built do
    end

    event :end_road_building do
      transition [:road_building_first_road, :road_building_second_road] => :after_roll
    end
  end

  # turn

  def current_user_turn?(user)
    user.players.find_by_game_id(id) == current_player
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

  # discard

  def current_user_discard?(user)
    user.players.find_by_game_id(id) == current_discard_player
  end

  def current_discard_player
    players[current_discard_player_number - 1]
  end

  def next_player_to_discard?
    players.exists?([%Q(resources > 7 and number > ?), current_discard_player_number])
  end

  def player_resources_discarded?
    current_discard_player_resources == current_discard_resource_limit
  end

  def next_player_discard
    player = players.find(:first, :conditions => [%Q(resources > 7 and number > ?), current_discard_player_number])
    self.current_discard_player_number = player.number
    self.current_discard_resource_limit = (player.resources + 1).div(2)
  end

  def reset_robber
    self.current_discard_player_number = 0
    self.current_discard_resource_limit = 0
  end

  # end game

  def winner?
    players.exists?([%Q(points >= 10)])
  end

  def winner
    players.find(:first, :conditions => "players.points >= 10")
  end

  def add_resources
    map_hexes.roll(current_roll).each(&:rolled)
  end

  def current_dice_roll
    dice_rolls.find_by_turn(current_turn)
  end

  def current_dice_roll?
    dice_rolls.exists?(:turn => current_turn)
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
    players.each(&:save)
  end

  def players_ready
    players.each do |player|
      errors.add :players, "are not ready" unless player.ready?
    end
  end
end
