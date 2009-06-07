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

class Exchange < ActiveRecord::Base
  include ToHash

  belongs_to :game
  belongs_to :player

  validates_numericality_of :bricks, :grain, :lumber, :ore, :wool, :only_integer => true, :allow_nil => true
  validates_presence_of :player
  validates_associated :player
  validate :exchange_resources_count, :bricks_exchange_rate, :grain_exchange_rate, :lumber_exchange_rate, :ore_exchange_rate, :wool_exchange_rate

  before_validation :exchange_resources
  after_save :save_player, :exchanged

  delegate :players, :exchanged!, :to => :game, :prefix => true
  delegate :bricks_exchange_rate, :grain_exchange_rate, :lumber_exchange_rate, :ore_exchange_rate, :wool_exchange_rate, :to => :player, :prefix => true

  attr_reader :user

  def user=(user)
    @user = user
    self.player = user_player
  end

  def user_player
    game_players.find_by_user_id(user.id)
  end

  protected

  def given_resources
    given_resources = 0
    given_resources -= bricks.div(player_bricks_exchange_rate) if bricks and bricks < 0
    given_resources -= grain.div(player_grain_exchange_rate) if grain and grain < 0
    given_resources -= lumber.div(player_lumber_exchange_rate) if lumber and lumber < 0
    given_resources -= ore.div(player_ore_exchange_rate) if ore and ore < 0
    given_resources -= wool.div(player_wool_exchange_rate) if wool and wool < 0
    given_resources
  end

  def wanted_resources
    wanted_resources = 0
    wanted_resources += bricks if bricks and bricks > 0
    wanted_resources += grain if grain and grain > 0
    wanted_resources += lumber if lumber and lumber > 0
    wanted_resources += ore if ore and ore > 0
    wanted_resources += wool if wool and wool > 0
    wanted_resources
  end

  def exchange_resources
    player.bricks += (bricks or 0)
    player.grain += (grain or 0)
    player.lumber += (lumber or 0)
    player.ore += (ore or 0)
    player.wool += (wool or 0)
  end

  def exchange_resources_count
    errors.add_to_base "You want too many/too few resources" if given_resources != wanted_resources
  end

  def bricks_exchange_rate
    errors.add :bricks, "exchange rate invalid" if bricks and bricks < 0 and bricks.modulo(player_bricks_exchange_rate) != 0
  end

  def grain_exchange_rate
    errors.add :grain, "exchange rate invalid" if grain and grain < 0 and grain.modulo(player_grain_exchange_rate) != 0
  end

  def lumber_exchange_rate
    errors.add :lumber, "exchange rate invalid" if lumber and lumber < 0 and lumber.modulo(player_lumber_exchange_rate) != 0
  end

  def ore_exchange_rate
    errors.add :ore, "exchange rate invalid" if ore and ore < 0 and ore.modulo(player_ore_exchange_rate) != 0
  end

  def wool_exchange_rate
    errors.add :wool, "exchange rate invalid" if wool and wool < 0 and wool.modulo(player_wool_exchange_rate) != 0
  end

  def exchanged
    game_exchanged!(user)
  end

  def save_player
    player.save
  end
end
