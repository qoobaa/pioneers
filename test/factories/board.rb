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

Factory.define :board do |b|
  b.size [7, 7]
  b.robber_position [2, 4]
  b.hexes_attributes [{ :position => [0, 3], :hex_type => "sea" },
                      { :position => [0, 4], :hex_type => "sea", :harbor_type => "generic", :harbor_position => 4 },
                      { :position => [0, 5], :hex_type => "sea" },
                      { :position => [0, 6], :hex_type => "sea", :harbor_type => "generic", :harbor_position => 3 },
                      { :position => [1, 2], :hex_type => "sea" },
                      { :position => [1, 3], :hex_type => "hill", :roll => 5 },
                      { :position => [1, 4], :hex_type => "mountain", :roll => 2 },
                      { :position => [1, 5], :hex_type => "field", :roll => 6 },
                      { :position => [1, 6], :hex_type => "sea" },
                      { :position => [2, 1], :hex_type => "sea", :harbor_type => "lumber", :harbor_position => 5 },
                      { :position => [2, 2], :hex_type => "forest", :roll => 10 },
                      { :position => [2, 3], :hex_type => "pasture", :roll => 9 },
                      { :position => [2, 4], :hex_type => "desert" },
                      { :position => [2, 5], :hex_type => "hill", :roll => 3 },
                      { :position => [2, 6], :hex_type => "sea", :harbor_type => "wool", :harbor_position => 2 },
                      { :position => [3, 0], :hex_type => "sea" },
                      { :position => [3, 1], :hex_type => "pasture", :roll => 8 },
                      { :position => [3, 2], :hex_type => "hill", :roll => 3 },
                      { :position => [3, 3], :hex_type => "pasture", :roll => 11 },
                      { :position => [3, 4], :hex_type => "forest", :roll => 4 },
                      { :position => [3, 5], :hex_type => "mountain", :roll => 8 },
                      { :position => [3, 6], :hex_type => "sea" },
                      { :position => [4, 0], :hex_type => "sea", :harbor_type => "bricks", :harbor_position => 5 },
                      { :position => [4, 1], :hex_type => "field", :roll => 4 },
                      { :position => [4, 2], :hex_type => "mountain", :roll => 6 },
                      { :position => [4, 3], :hex_type => "field", :roll => 5 },
                      { :position => [4, 4], :hex_type => "forest", :roll => 10 },
                      { :position => [4, 5], :hex_type => "sea", :harbor_type => "ore", :harbor_position => 2 },
                      { :position => [5, 0], :hex_type => "sea" },
                      { :position => [5, 1], :hex_type => "forest", :roll => 11 },
                      { :position => [5, 2], :hex_type => "field", :roll => 12 },
                      { :position => [5, 3], :hex_type => "pasture", :roll => 9 },
                      { :position => [5, 4], :hex_type => "sea" },
                      { :position => [6, 0], :hex_type => "sea", :harbor_type => "generic", :harbor_position => 0 },
                      { :position => [6, 1], :hex_type => "sea", :harbor_type => "grain", :harbor_position => 0 },
                      { :position => [6, 2], :hex_type => "sea" },
                      { :position => [6, 3], :hex_type => "sea", :harbor_type => "generic", :harbor_position => 1 }]
end
