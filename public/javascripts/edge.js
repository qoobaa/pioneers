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

Pioneers.Edge = function(attributes) {
  this.position = attributes.position;
  this.playerId = attributes.playerId;

  this.row = function() {
    return this.position[0];
  };

  this.col = function() {
    return this.position[1];
  };

  this.hexPositions = function() {
    if(this.col() % 3 == 0) {
      return [[this.row(), this.col() / 3 - 1],
              [this.row(), this.col() / 3 - 2]];
    } else if(this.col() % 3 == 1) {
      return [[this.row() - 1, (this.col() - 1) / 3 - 1],
              [this.row(), (this.col() - 1) / 3 - 1]];
    } else {
      return [[this.row() - 1, (this.col() - 2) / 3],
              [this.row(), (this.col() - 2) / 3 - 1]];
    }
  };

  this.nodePositions = function() {
    return [this.leftNodePosition(), this.rightNodePosition()];
  };

  this.rightNodePosition = function() {
    if(this.col() % 3 == 0) {
      return [this.row(), 2 * this.col() / 3 - 1];
    } else if(this.col() % 3 == 1) {
      return [this.row(), 2 * (this.col() - 1) / 3];
    } else {
      return [this.row(), 2 * (this.col() - 2) / 3 + 1];
    }
  };

  this.leftNodePosition = function() {
    if(this.col() % 3 == 0) {
      return [this.row() + 1, 2 * this.col() / 3 - 2];
    } else if(this.col() % 3 == 1) {
      return [this.row(), 2 * (this.col() - 1) / 3 - 1];
    } else {
      return [this.row(), 2 * (this.col() - 2) / 3];
    }
  };

  this.edgePositions = function() {
    return [this.leftEdgePositions[0],
            this.leftEdgePositions[1],
            this.rightEdgePositions[0],
            this.rightEdgePositions[1]];
  };

  this.leftEdgePositions = function() {
    if(this.col() % 3 == 0) {
      return [[this.row() + 1, this.col() - 2],
              [this.row() + 1, this.col() - 1]];
    } else if(this.col() % 3 == 1) {
      return [[this.row(), this.col() - 2],
              [this.row(), this.col() - 1]];
    } else {
      return [[this.row() - 1, this.col() + 1],
              [this.row(), this.col() - 1]];
    }
  };

  this.rightEdgePositions = function() {
    if(this.col() % 3 == 0) {
      return [[this.row(), this.col() + 1],
              [this.row(), this.col() - 1]];
    } else if(this.col() % 3 == 1) {
      return [[this.row() - 1, this.col() + 2],
              [this.row(), this.col() + 1]];
    } else {
      return [[this.row(), this.col() + 2],
              [this.row(), this.col() + 1]];
    }
  };
};
