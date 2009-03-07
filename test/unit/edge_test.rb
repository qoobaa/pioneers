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
end
