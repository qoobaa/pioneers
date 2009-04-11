// Pioneers - web game based on the Settlers of Catan board game.

// Copyright (C) 2009 Jakub Kuźma <qoobaa@gmail.com>

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var Pioneers = Pioneers || {};

Pioneers.Hex = function(map, attributes) {
  this.row = function() {
    return this.position[0];
  };

  this.col = function() {
    return this.position[1];
  };

  this.hexPositions = function() {
    return [[this.row() - 1, this.col() + 1],
            [this.row() - 1, this.col()],
            [this.row(), this.col() - 1],
            [this.row() + 1, this.col() - 1],
            [this.row() + 1, this.col()],
            [this.row(), this.col() + 1]];
  };

  this.hexes = function() {
    var map = this.map;
    return $.map(this.hexPositions(),
                 function(position) {
                   return map.hex(position);
                 }
                );
  };

  this.nodePositions = function() {
    return [[this.row(), 2 * this.col() + 3],
            [this.row(), 2 * this.col() + 2],
            [this.row(), 2 * this.col() + 1],
            [this.row() + 1, 2 * this.col()],
            [this.row() + 1, 2 * this.col() + 1],
            [this.row() + 1, 2 * this.col() + 2]];
  };

  this.nodes = function() {
    var map = this.map;
    return $.map(this.nodePositions(),
                 function(position) {
                   return map.node(position);
                 }
                );
  };

  this.edgePositions = function() {
    return [[this.row(), 3 * this.col() + 5],
            [this.row(), 3 * this.col() + 4],
            [this.row(), 3 * this.col() + 3],
            [this.row() + 1, 3 * this.col() + 2],
            [this.row() + 1, 3 * this.col() + 4],
            [this.row(), 3 * this.col() + 6]];
  };

  this.edges = function() {
    var map = this.map;
    return $.map(this.edgePositions(),
                 function(position) {
                   return map.edge(position);
                 }
                );
  };

  this.map = map;
  this.position = attributes.position;
  this.type = attributes.type;
  this.harborType = attributes.harborType;
  this.harborPosition = attributes.harborPosition;
};
