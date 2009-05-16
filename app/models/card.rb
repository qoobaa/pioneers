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

class Card < ActiveRecord::Base
  include ToHash

  belongs_to :game
  belongs_to :player

  validates_presence_of :player, :type
  validates_associated :player
  validate :player_not_changed

  before_validation_on_create :buy_card

  after_create :save_game, :card_bought
  after_save :save_player

  attr_reader :user

  delegate :take_random_card, :players, :card_bought!, :to => :game, :prefix => true
  delegate :number, :to => :player, :prefix => true

  state_machine :initial => :tapped do
    event :untap do
      transition :tapped => :untapped
    end

    before_transition :on => :untap, :do => :before_untap

    event :play do
      transition :untapped => :graveyard
    end

    before_transition :on => :play, :do => :before_play
  end

  def user=(user)
    @user = user
    self.player ||= user_player
  end

  def user_player
    game_players.find_by_user_id(user.id)
  end

  def class_name
    self.class.name
  end

  protected

  def buy_card
    set_type
    charge_for_card
  end

  def set_type
    random_card = game_take_random_card
    if random_card
      self.type = "Card::#{random_card.to_s.classify}"
    end
  end

  def charge_for_card
    player.grain -= 1
    player.ore -= 1
    player.wool -= 1
  end

  def card_bought
    game_card_bought!(user)
  end

  def save_player
    player.save
  end

  def save_game
    game.save
  end

  def player_not_changed
    errors.add :player, "cannot be changed" if user and player != user_player
  end

  def before_untap
    # do nothing
  end

  def before_play
    # do nothing
  end
end
