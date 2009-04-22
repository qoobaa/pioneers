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

Pioneers.Hex = function(board, attributes) {
  this.getRow = function() {
    return this.position[0];
  };

  this.getCol = function() {
    return this.position[1];
  };

  this.getPosition = function() {
    return this.position;
  };

  this.getBoard = function() {
    return this.board;
  };

  this.getType = function() {
    return this.type;
  };

  this.getRoll = function() {
    return this.roll;
  };

  this.isSettleable = function() {
    return this.getType() != "sea";
  };

  this.isHarbor = function() {
    return this.getHarborType() != undefined;
  };

  this.getHarborPosition = function() {
    return this.harborPosition;
  };

  this.getHarborType = function() {
    return this.harborType;
  };

  this.getHexPositions = function() {
    return [[this.getRow() - 1, this.getCol() + 1],
            [this.getRow() - 1, this.getCol()],
            [this.getRow(), this.getCol() - 1],
            [this.getRow() + 1, this.getCol() - 1],
            [this.getRow() + 1, this.getCol()],
            [this.getRow(), this.getCol() + 1]];
  };

  this.getHexes = function() {
    var board = this.getBoard();
    return $.map(this.hexPositions(),
                 function(position) {
                   return board.getHex(position);
                 }
                );
  };

  this.getNodePositions = function() {
    return [[this.getRow(), 2 * this.getCol() + 3],
            [this.getRow(), 2 * this.getCol() + 2],
            [this.getRow(), 2 * this.getCol() + 1],
            [this.getRow() + 1, 2 * this.getCol()],
            [this.getRow() + 1, 2 * this.getCol() + 1],
            [this.getRow() + 1, 2 * this.getCol() + 2]];
  };

  this.getNodes = function() {
    var board = this.getBoard();
    return $.map(this.getNodePositions(),
                 function(position) {
                   return board.getNode(position);
                 }
                );
  };

  this.getRobbableNodes = function(playerNumber) {
    return $.grep(this.getNodes(),
                  function(node) {
                    return node.isSettled() && node.getPlayerNumber() != playerNumber;
                  }
                 );
  };

  this.getEdgePositions = function() {
    return [[this.getRow(), 3 * this.getCol() + 5],
            [this.getRow(), 3 * this.getCol() + 4],
            [this.getRow(), 3 * this.getCol() + 3],
            [this.getRow() + 1, 3 * this.getCol() + 2],
            [this.getRow() + 1, 3 * this.getCol() + 4],
            [this.getRow(), 3 * this.getCol() + 6]];
  };

  this.getEdges = function() {
    var board = this.getBoard();
    return $.map(this.edgePositions(),
                 function(position) {
                   return board.getEdge(position);
                 }
                );
  };

  this.init = function(board, attributes) {
    this.board = board;
    this.position = attributes.position;
    this.type = attributes.type;
    this.roll = attributes.roll;
    this.harborType = attributes.harborType;
    this.harborPosition = attributes.harborPosition;
  };

  this.init(board, attributes);
};

Pioneers.Hex.createExisting = function(board, attributes) {
  return new Pioneers.Hex(board, attributes);
};
