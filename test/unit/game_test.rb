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

  context "In first_settlement phase of first player" do
    setup do
      @game = Game.create!
      3.times { @game.players << Factory(:player, :settlements => 5) }
      @game.map = Factory(:map, :hexes_attributes => [{ :hex_type => "forest", :roll => 2 }, { :hex_type => "forest", :roll => 2}, { :hex_type => "sea" }, { :hex_type => "sea" }], :size => [2, 2] )
      @game.current_player_number = 1
      @game.aasm_state = "first_settlement"
      @game.save!
    end

    should "allow to build first settlement by first player" do
      node = @game.map_nodes.build(:position => [0, 1])
      node.player = @game.players[0]
      assert node.valid?
    end

    should "not allow to build settlement by second player" do
      node = @game.map_nodes.build(:position => [0, 1])
      node.player = @game.players[1]
      assert !node.valid?
    end

    should "not allow to build second settlement by first player" do
      node = @game.map_nodes.build(:position => [0, 1])
      node.player = @game.players[0]
      node.save!
      node = @game.map_nodes.build(:position => [0, 3])
      node.player = @game.players[0]
      assert !node.valid?
    end

    should "not allow to build settlement on the sea" do
      node = @game.map_nodes.build(:position => [1, 5])
      node.player = @game.players[0]
      assert !node.valid?
    end

#     should "not allow to build road by first player" do
#       edge = @game.map_edges.build(:position => [0, 3])
#       edge.player = @game.players[0]
#       assert !edge.valid?
#     end
  end

  context "In first_settlement phase of second player with settlement on [0, 1] and road on [0, 3]" do
    setup do
      @game = Game.create!
      3.times { @game.players << Factory(:player, :settlements => 5) }
      @game.map = Factory(:map, :hexes_attributes => [{ :hex_type => "forest", :roll => 2 }, { :hex_type => "forest", :roll => 2}, { :hex_type => "sea" }, { :hex_type => "sea" }], :size => [2, 2] )
      @game.current_player_number = 1
      @game.aasm_state = "first_settlement"
      @game.save!
      node = @game.map_nodes.build(:position => [0, 1])
      node.player = @game.players[0]
      node.save!
      @game.aasm_state = "first_road"
      @game.save!
      edge = @game.map_edges.build(:position => [0, 3])
      edge.player = @game.players[0]
      edge.save!
      @game.current_player_number = 2
      @game.aasm_state = "first_settlement"
      @game.save!
    end

    should "not allow to build settlement by first player" do
      node = @game.map_nodes.build(:position => [0, 3])
      node.player = @game.players[0]
      assert !node.valid?
    end

    should "not allow to build settlement on the same position by second player" do
      node = @game.map_nodes.build(:position => [0, 1])
      node.player = @game.players[1]
      assert !node.valid?
    end

    should "not allow to build settlement too close to first settlement by second player" do
      node = @game.map_nodes.build(:position => [0, 2])
      node.player = @game.players[1]
      assert !node.valid?
    end

    should "allow to build settlement on correct position by second player" do
      node = @game.map_nodes.build(:position => [0, 3])
      node.player = @game.players[1]
      assert node.valid?
    end

    should "not allow to build second settlement by second player" do
      node = @game.map_nodes.build(:position => [0, 3])
      node.player = @game.players[1]
      node.save!
      node = @game.map_nodes.build(:position => [0, 5])
      node.player = @game.players[1]
      assert !node.valid?
    end
  end

  context "In after_roll phase of first player with settlement on [0, 1] and road on [0, 3]" do
    setup do
      @game = Game.create!
      3.times { @game.players << Factory(:player, :settlements => 5, :bricks => 5, :ore => 5, :wool => 5, :lumber => 5, :grain => 5) }
      @game.map = Factory(:map, :hexes_attributes => [{ :hex_type => "forest", :roll => 2 }, { :hex_type => "forest", :roll => 2}, { :hex_type => "sea" }, { :hex_type => "sea" }], :size => [2, 2] )
      @game.current_player_number = 1
      @game.aasm_state = "first_settlement"
      @game.save!
      node = @game.map_nodes.build(:position => [0, 1])
      node.player = @game.players[0]
      node.save!
      @game.aasm_state = "first_road"
      @game.save!
      edge = @game.map_edges.build(:position => [0, 3])
      edge.player = @game.players[0]
      edge.save!
      @game.current_player_number = 1
      @game.aasm_state = "after_roll"
      @game.save!
    end

    should "not allow to build on position without road by first player" do
      node = @game.map_nodes.build(:position => [1, 1])
      node.player = @game.players[0]
      assert !node.valid?
    end

    should "allow to build on position with road by first player" do
      edge = @game.map_edges.build(:position => [1, 2])
      edge.player = @game.players[0]
      edge.save!
      node = @game.map_nodes.build(:position => [1, 1])
      node.player = @game.players[0]
      assert node.valid?
    end

    should "not allow to build settlement by second player" do
      node = @game.map_nodes.build(:position => [1, 1])
      node.player = @game.players[1]
      assert !node.valid?
    end
  end
end
