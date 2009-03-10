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

class EdgeTest < Test::Unit::TestCase
  context "With position [3, 15]" do
    setup { @edge = Edge.new(:position => [3, 15]) }

    should "return correct hex positions" do
      assert_equal [[3, 4], [3, 3]], @edge.hex_positions
    end

    should "return correct node positions" do
      assert_equal [[3, 9], [4, 8]], @edge.node_positions
    end

    should "return correct edge positions" do
      assert_equal [[3, 16], [3, 14], [4, 13], [4, 14]], @edge.edge_positions
    end
  end

  context "With position [6, 13]" do
    setup { @edge = Edge.new(:position => [6, 13]) }

    should "return correct hex positions" do
      assert_equal [[5, 3], [6, 3]], @edge.hex_positions
    end

    should "return correct node positions" do
      assert_equal [[6, 8], [6, 7]], @edge.node_positions
    end

    should "return correct edge positions" do
      assert_equal [[5, 15], [6, 11], [6, 12], [6, 14]], @edge.edge_positions
    end
  end

  context "With position [1, 20]" do
    setup { @edge = Edge.new(:position => [1, 20]) }

    should "return correct hex positions" do
      assert_equal [[0, 6], [1, 5]], @edge.hex_positions
    end

    should "return correct node positions" do
      assert_equal [[1, 13], [1, 12]], @edge.node_positions
    end

    should "return correct edge positions" do
      assert_equal [[1, 22], [0, 21], [1, 19], [1, 21]], @edge.edge_positions
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

    should "not allow to build road by first player" do
      edge = @game.map_edges.build(:position => [0, 3])
      edge.player = @game.players[0]
      assert !edge.valid?
    end
  end

  context "In first_road phase of first player" do
    setup do
      @game = Game.create!
      3.times { @game.players << Factory(:player, :settlements => 5, :roads => 15) }
      @game.map = Factory(:map, :hexes_attributes => [{ :hex_type => "forest", :roll => 2 }, { :hex_type => "forest", :roll => 2}, { :hex_type => "sea" }, { :hex_type => "sea" }], :size => [2, 2] )
      @game.current_player_number = 1
      @game.aasm_state = "first_settlement"
      @game.save!
      node = @game.map_nodes.build(:position => [0, 1])
      node.player = @game.players[0]
      node.save!
      @game.aasm_state = "first_road"
      @game.save!
    end

    should "allow to build road near first settlement by first player" do
      edge = @game.map_edges.build(:position => [0, 3])
      edge.player = @game.players[0]
      assert edge.valid?
    end

    should "not allow to build road near first settlement by second player" do
      edge = @game.map_edges.build(:position => [0, 3])
      edge.player = @game.players[1]
      assert !edge.valid?
    end

    should "not allow to build road away from first settlement by first player" do
      edge = @game.map_edges.build(:position => [0, 5])
      edge.player = @game.players[0]
      assert !edge.valid?
    end
  end

  context "In second_road phase of first player" do
    setup do
      @game = Game.create!
      3.times { @game.players << Factory(:player, :settlements => 5, :roads => 15) }
      @game.map = Factory(:map, :hexes_attributes => [{ :hex_type => "desert" }, { :hex_type => "forest", :roll => 2}, { :hex_type => "sea" }, { :hex_type => "sea" }], :size => [2, 2] )
      @game.current_player_number = 1
      @game.aasm_state = "first_settlement"
      @game.save!
      node = @game.map_nodes.build(:position => [0, 3])
      node.player = @game.players[0]
      node.save!
      @game.aasm_state = "first_road"
      @game.save!
      edge = @game.map_edges.build(:position => [0, 7])
      edge.player = @game.players[0]
      edge.save!
      @game.aasm_state = "second_settlement"
      @game.save!
      node = @game.map_nodes.build(:position => [0, 1])
      node.player = @game.players[0]
      node.save!
      @game.aasm_state = "second_road"
      @game.save!
    end

    should "not allow to build road near first settlement by first player" do
      edge = @game.map_edges.build(:position => [0, 6])
      edge.player = @game.players[0]
      assert !edge.valid?
    end

    should "not allow to build road near second settlement by second player" do
      edge = @game.map_edges.build(:position => [0, 3])
      edge.player = @game.players[1]
      assert !edge.valid?
    end

    should "not allow to build road away from first settlement by first player" do
      edge = @game.map_edges.build(:position => [1, 3])
      edge.player = @game.players[0]
      assert !edge.valid?
    end

    should "allow to build road near second settlement by first player" do
      edge = @game.map_edges.build(:position => [0, 3])
      edge.player = @game.players[0]
      assert edge.valid?
    end
  end

  context "In after_roll phase of first player with settlement(player1) on [0, 1] and road(player1) on [0, 3], settlement(player2) on [1, 3]" do
    setup do
      @game = Game.create!
      3.times { @game.players << Factory(:player, :settlements => 5, :bricks => 5, :ore => 5, :wool => 5, :lumber => 5, :grain => 5, :cities => 5, :roads => 15) }
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
      @game.aasm_state = "first_settlement"
      @game.current_player_number = 2
      @game.save!
      node = @game.map_nodes.build(:position => [1, 3])
      node.player = @game.players[1]
      node.save!
      @game.current_player_number = 1
      @game.aasm_state = "after_roll"
      @game.save!
    end

    should "allow to build road near first settlement by first player" do
      edge = @game.map_edges.build(:position => [0, 4])
      edge.player = @game.players[0]
      assert edge.valid?
    end

    should "allow to build road near first road by first player" do
      edge = @game.map_edges.build(:position => [1, 2])
      edge.player = @game.players[0]
      assert edge.valid?
    end

    should "not allow to build road on not settleable edge by first player" do
      edge = @game.map_edges.build(:position => [0, 2])
      edge.player = @game.players[0]
      assert !edge.valid?
    end

    should "not allow to build road near first settlement of second player by first player" do
      edge = @game.map_edges.build(:position => [1, 5])
      edge.player = @game.players[0]
      assert !edge.valid?
    end

    should "not allow to build road if player has no resources by first player" do
      @game.players[0].update_attributes(:bricks => 0)
      edge = @game.map_edges.build(:position => [0, 4])
      edge.player = @game.players[0]
      assert !edge.valid?
    end

    should "not allow to build road if player has no roads by first player" do
      @game.players[0].update_attributes(:roads => 0)
      edge = @game.map_edges.build(:position => [0, 4])
      edge.player = @game.players[0]
      assert !edge.valid?
    end

    should "not allow to build road by second player" do
      edge = @game.map_edges.build(:position => [1, 5])
      edge.player = @game.players[1]
      assert !edge.valid?
    end

    should "not allow to build road through first settlement of second player by first player" do
      edge = @game.map_edges.build(:position => [1, 2])
      edge.player = @game.players[0]
      edge.save!
      edge = @game.map_edges.build(:position => [1, 4])
      edge.player = @game.players[0]
      edge.save!
      edge = @game.map_edges.build(:position => [1, 5])
      edge.player = @game.players[0]
      edge.save!
      edge = @game.map_edges.build(:position => [1, 7])
      edge.player = @game.players[0]
      assert !edge.valid?
    end
  end
end
