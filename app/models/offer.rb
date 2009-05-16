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

class Offer < ActiveRecord::Base
  include ToHash

  belongs_to :game
  belongs_to :sender, :class_name => "Player"
  belongs_to :recipient, :class_name => "Player"

  has_many :offer_responses
  has_many :players, :through => :offer_responses
  has_many :agreed_players, :through => :offer_responses, :source => :player, :conditions => { :offer_responses => { :agreed => true } }
  has_many :declined_players, :through => :offer_responses, :source => :player, :conditions => { :offer_responses => { :agreed => false } }

  validates_uniqueness_of :state, :scope => :game_id, :if => :awaiting?
  validates_numericality_of :bricks, :grain, :lumber, :ore, :wool, :only_integer => true, :allow_nil => true
  validates_presence_of :sender
  validates_associated :sender, :recipient

  delegate :number, :to => :sender, :prefix => true
  delegate :number, :to => :recipient, :prefix => true, :allow_nil => true

  before_validation :sum_sender_resources, :sum_recipient_resources

  after_update :trade

  after_create :offer_created
  after_update :offer_expired

  delegate :players, :offer_created!, :offer_expired!, :to => :game, :prefix => true

  attr_reader :user

  state_machine :initial => :awaiting do
    event :accept do
      transition :awaiting => :accepted
    end

    event :decline do
      transition :awaiting => :declined
    end
  end

  def user=(user)
    @user = user
    self.sender = user_player
  end

  def user_player
    game_players.find_by_user_id(user.id)
  end

  def recipient_number=(number)
    self.recipient = agreed_players.find_by_number(number)
  end

  protected

  def sum_sender_resources
    sender.bricks += (bricks or 0)
    sender.grain += (grain or 0)
    sender.lumber += (lumber or 0)
    sender.ore += (ore or 0)
    sender.wool += (wool or 0)
  end

  def sum_recipient_resources
    return if recipient.nil?
    recipient.bricks -= (bricks or 0)
    recipient.grain -= (grain or 0)
    recipient.lumber -= (lumber or 0)
    recipient.ore -= (ore or 0)
    recipient.wool -= (wool or 0)
  end

  def trade
    return unless accepted?
    sender.save
    recipient.save
  end

  def offer_created
    game_offer_created!(user)
  end

  def offer_expired
    game_offer_expired!(user)
  end
end
