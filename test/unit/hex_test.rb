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

class HexTest < Test::Unit::TestCase
  context "Validations" do
    setup { @hex = Factory.build(:hex, :position => [0, 0]) }

    should "not be valid with harbor position, without harbor type" do
      @hex.harbor_position = 0
      @hex.harbor_type = nil
      assert !@hex.valid?
    end
  end

  context "With position [0, 0]" do
    setup { @hex = Factory.build(:hex, :position => [0, 0]) }

    should "return correct node positions" do
      assert_equal [[0, 3], [0, 2], [0, 1], [1, 0], [1, 1], [1, 2]], @hex.node_positions
    end

    should "return correct edge positions" do
      assert_equal [[0, 5], [0, 4], [0, 3], [1, 2], [1, 4], [0, 6]], @hex.edge_positions
    end

    should "return correct hex positions" do
      assert_equal [[-1, 1], [-1, 0], [0, -1], [1, -1], [1, 0], [0, 1]], @hex.hex_positions
    end
  end

  context "With position [6, 3]" do
    setup { @hex = Factory.build(:hex, :position => [6, 3]) }

    should "return correct node positions" do
      assert_equal [[6, 9], [6, 8], [6, 7], [7, 6], [7, 7], [7, 8]], @hex.node_positions
    end

    should "return correct edge positions" do
      assert_equal [[6, 14], [6, 13], [6, 12], [7, 11], [7, 13], [6, 15]], @hex.edge_positions
    end

    should "return correct hex positions" do
      assert_equal [[5, 4], [5, 3], [6, 2], [7, 2], [7, 3], [6, 4]], @hex.hex_positions
    end
  end

  context "With position [3, 4]" do
    setup { @hex = Factory.build(:hex, :position => [3, 4]) }

    should "return correct node positions" do
      assert_equal [[3, 11], [3, 10], [3, 9], [4, 8], [4, 9], [4, 10]], @hex.node_positions
    end

    should "return correct edge positions" do
      assert_equal [[3, 17], [3, 16], [3, 15], [4, 14], [4, 16], [3, 18]], @hex.edge_positions
    end

    should "return correct hex positions" do
      assert_equal [[2, 5], [2, 4], [3, 3], [4, 3], [4, 4], [3, 5]], @hex.hex_positions
    end
  end

  context "With hex type of hill" do
    setup { @hex = Factory.build(:hex, :hex_type => "hill") }

    should "return bricks resource type" do
      assert_equal "bricks", @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of field" do
    setup { @hex = Factory.build(:hex, :hex_type => "field") }

    should "return bricks resource type" do
      assert_equal "grain", @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of mountain" do
    setup { @hex = Factory.build(:hex, :hex_type => "mountain") }

    should "return bricks resource type" do
      assert_equal "ore", @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of pasture" do
    setup { @hex = Factory.build(:hex, :hex_type => "pasture") }

    should "return wool resource type" do
      assert_equal "wool", @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of forest" do
    setup { @hex = Factory.build(:hex, :hex_type => "forest") }

    should "return lumber resource type" do
      assert_equal "lumber", @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of desert" do
    setup { @hex = Factory.build(:hex, :hex_type => "desert") }

    should "return lumber resource type" do
      assert_nil @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of sea" do
    setup { @hex = Factory.build(:hex, :hex_type => "sea") }

    should "return lumber resource type" do
      assert_nil @hex.resource_type
    end

    should "not be settleable" do
      assert !@hex.settleable?
    end
  end

  context "With harbor on position 0" do
    setup { @hex = Factory.build(:hex, :position => [1, 1], :harbor_position => 0) }

    should "have harbor" do
      assert @hex.harbor?
    end

    should "have harbor on node position [1, 5]" do
      assert @hex.harbor_on?([1, 5])
    end

    should "have harbor on node position [1, 4]" do
      assert @hex.harbor_on?([1, 4])
    end
  end

  context "With harbor on position 5" do
    setup { @hex = Factory.build(:hex, :position => [1, 1], :harbor_position => 5) }

    should "have harbor" do
      assert @hex.harbor?
    end

    should "have harbor on node position [1, 5]" do
      assert @hex.harbor_on?([1, 5])
    end

    should "have harbor on node position [2, 4]" do
      assert @hex.harbor_on?([2, 4])
    end
  end

  context "with neighbour node" do
    setup do
      @hex = Factory.build(:hex, :hex_type => "forest")
      @node = Object.new
      stub(@hex).nodes { [@node] }
    end

    should "add resources to neighbour nodes without robber when rolled" do
      stub(@hex).robber? { false }
      mock(@node).add_resources("lumber")
      @hex.rolled
    end

    should "not add resources to neighbour nodes with robber when rolled" do
      stub(@hex).robber? { true }
      dont_allow(@node).add_resources
      @hex.rolled
    end
  end
end
