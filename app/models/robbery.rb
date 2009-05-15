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

class Robbery < ActiveRecord::Base
  include ToHash

  belongs_to :game
  belongs_to :sender, :class_name => "Player"
  belongs_to :recipient, :class_name => "Player"

  validates_numericality_of :bricks, :grain, :lumber, :ore, :wool, :only_integer => true, :allow_nil => true
  validates_numericality_of :row, :col, :only_integer => true
  validate :position_settleable, :position_changed, :sender_in_neighbourhood

  delegate :board, :to => :game
  delegate :hexes, :robber_position, :robber_position=, :to => :board, :prefix => true
  delegate :robbed!, :players, :to => :game, :prefix => true
  delegate :number, :to => :sender, :prefix => true
  delegate :number, :to => :recipient, :prefix => true

  before_validation :associate_sender
  before_save :rob_player
  after_save :robbed, :update_board_robber_position

  attr_reader :user
  attr_accessor :sender_number

  def user=(user)
    @user = user
    self.recipient = user_player
  end

  def user_player
    game_players.find_by_user_id(user.id)
  end

  def position
    [row, col]
  end

  def position=(position)
    self.row, self.col = position
  end

  def hex
    board_hexes.find_by_position(position)
  end

  def players
    hex.nodes.compact.map(&:player)
  end

  def user_player
    game_players.find_by_user_id(user.id)
  end

  def associate_sender
    self.sender = game_players.find_by_number(sender_number)
  end

  protected

  def position_changed?
    position != board_robber_position
  end

  def position_settleable
    errors.add :position, "hex is not settleable" unless hex and hex.settleable?
  end

  def position_changed
    errors.add :position, "must be changed" unless position_changed?
  end

  def robbed
    game_robbed!(user)
  end

  def sender_in_neighbourhood
    errors.add :sender, "must be in neighbourhood" unless players.include? sender
  end

  def rob_player
    resource_type = sender.rob_resource
    if resource_type
      self[resource_type] = 1
      recipient[resource_type] += 1
      sender.save
      recipient.save
    end
  end

  def update_board_robber_position
    self.board_robber_position = position
    board.save!
  end
end
