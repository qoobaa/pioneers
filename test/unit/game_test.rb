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

require 'test_helper'

class GameTest < Test::Unit::TestCase
  should_have_many :players
  should_have_one :map

  context "In waiting_for_players phase" do
    setup do
      @game = Game.create!
    end

    should "not allow to start without players" do
      assert !@game.start!
      assert @game.errors.on(:players)
    end

    should "not allow to start without map" do
      assert !@game.start!
      assert @game.errors.on(:map)
    end

    should "not allow to start with one player" do
      @game.players << Factory(:player)
      assert !@game.start!
      assert @game.errors.on(:players)
    end

    should "not allow to start with two players" do
      2.times { @game.players << Factory(:player) }
      assert !@game.start!
      assert @game.errors.on(:players)
    end

    should "allow to start with map and three players" do
      3.times { @game.players << Factory(:player) }
      @game.map = Factory(:map)
      assert @game.start!
    end
  end

  context "State machine" do
    setup do
      @game = Game.create!
      3.times { @game.players << Factory(:player) }
      @game.map = Factory(:map)
      @game.save
    end

    should "work" do
      assert_equal "waiting_for_players", @game.aasm_state
      assert @game.start!
      assert_equal "first_settlement", @game.aasm_state
      assert_equal 1, @game.current_player_number
      assert @game.end_turn!
      assert_equal "first_road", @game.aasm_state
      assert_equal 1, @game.current_player_number
      assert @game.end_turn!
      assert_equal "first_settlement", @game.aasm_state
      assert_equal 2, @game.current_player_number
      assert @game.end_turn!
      assert_equal "first_road", @game.aasm_state
      assert_equal 2, @game.current_player_number
      assert @game.end_turn!
      assert_equal "first_settlement", @game.aasm_state
      assert_equal 3, @game.current_player_number
      assert @game.end_turn!
      assert_equal "first_road", @game.aasm_state
      assert_equal 3, @game.current_player_number
      assert @game.end_turn!
      assert_equal "second_settlement", @game.aasm_state
      assert_equal 3, @game.current_player_number
      assert @game.end_turn!
      assert_equal "second_road", @game.aasm_state
      assert_equal 3, @game.current_player_number
      assert @game.end_turn!
      assert_equal "second_settlement", @game.aasm_state
      assert_equal 2, @game.current_player_number
      assert @game.end_turn!
      assert_equal "second_road", @game.aasm_state
      assert_equal 2, @game.current_player_number
      assert @game.end_turn!
      assert_equal "second_settlement", @game.aasm_state
      assert_equal 1, @game.current_player_number
      assert @game.end_turn!
      assert_equal "second_road", @game.aasm_state
      assert_equal 1, @game.current_player_number
      assert @game.end_turn!
      assert_equal "before_roll", @game.aasm_state
      assert_equal 1, @game.current_player_number
      assert @game.end_turn!
      assert_equal "after_roll", @game.aasm_state
      assert_equal 1, @game.current_player_number
      assert @game.end_turn!
      assert_equal "before_roll", @game.aasm_state
      assert_equal 2, @game.current_player_number
      assert @game.end_turn!
      assert_equal "after_roll", @game.aasm_state
      assert_equal 2, @game.current_player_number
      assert @game.end_turn!
      assert_equal "before_roll", @game.aasm_state
      assert_equal 3, @game.current_player_number
      assert @game.end_turn!
      assert_equal "after_roll", @game.aasm_state
      assert_equal 3, @game.current_player_number
      assert @game.end_turn!
      assert_equal "before_roll", @game.aasm_state
      assert_equal 1, @game.current_player_number
      assert @game.end_turn!
      assert_equal "after_roll", @game.aasm_state
      assert_equal 1, @game.current_player_number
      assert @game.end_turn!
    end
  end
end
