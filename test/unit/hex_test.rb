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
  should_belong_to :map
  should_allow_values_for :roll, [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, nil]
  should_allow_values_for :hex_type, ["hill", "field", "mountain", "pasture", "forest", "sea"]
  # should_validate_uniqueness_of :map_id, :scoped_to => [:x, :y]

  context "With position [0, 0]" do
    setup { @hex = Hex.new(:position => [0, 0]) }

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
    setup { @hex = Hex.new(:position => [6, 3]) }

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
    setup { @hex = Hex.new(:position => [3, 4]) }

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
    setup { @hex = Hex.new(:hex_type => "hill") }

    should "return bricks resource type" do
      assert_equal "bricks", @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of field" do
    setup { @hex = Hex.new(:hex_type => "field") }

    should "return bricks resource type" do
      assert_equal "grain", @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of mountain" do
    setup { @hex = Hex.new(:hex_type => "mountain") }

    should "return bricks resource type" do
      assert_equal "ore", @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of pasture" do
    setup { @hex = Hex.new(:hex_type => "pasture") }

    should "return wool resource type" do
      assert_equal "wool", @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of forest" do
    setup { @hex = Hex.new(:hex_type => "forest") }

    should "return lumber resource type" do
      assert_equal "lumber", @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of desert" do
    setup { @hex = Hex.new(:hex_type => "desert") }

    should "return lumber resource type" do
      assert_nil @hex.resource_type
    end

    should "be settleable" do
      assert @hex.settleable?
    end
  end

  context "With hex type of sea" do
    setup { @hex = Hex.new(:hex_type => "sea") }

    should "return lumber resource type" do
      assert_nil @hex.resource_type
    end

    should "not be settleable" do
      assert !@hex.settleable?
    end
  end
end
