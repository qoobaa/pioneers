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

Pioneers.Edge = function(board, position) {
  this.getPosition = function() {
    return this.position;
  };

  this.getRow = function() {
    return this.position[0];
  };

  this.getCol = function() {
    return this.position[1];
  };

  this.getBoard = function() {
    return this.board;
  };

  this.isSettled = function() {
    return this.getPlayerId() != null;
  };

  this.getPlayerId = function() {
    return this.playerId;
  };

  this.getHexPositions = function() {
    if(this.getCol() % 3 == 0) {
      return [[this.getRow(), this.getCol() / 3 - 1],
              [this.getRow(), this.getCol() / 3 - 2]];
    } else if(this.getCol() % 3 == 1) {
      return [[this.getRow() - 1, (this.getCol() - 1) / 3 - 1],
              [this.getRow(), (this.getCol() - 1) / 3 - 1]];
    } else {
      return [[this.getRow() - 1, (this.getCol() - 2) / 3],
              [this.getRow(), (this.getCol() - 2) / 3 - 1]];
    }
  };

  this.getHexes = function() {
    var board = this.getBoard();
    return $.map(this.getHexPositions(),
                 function(position) {
                   return board.getHex(position);
                 }
                );
  };

  this.isSettleable = function() {
    return $.grep(this.getHexes(),
                  function(hex) {
                    return hex.isSettleable();
                  }
                 ).length != 0;
  };

  this.getRightNodePosition = function() {
    if(this.getCol() % 3 == 0) {
      return [this.getRow(), 2 * this.getCol() / 3 - 1];
    } else if(this.getCol() % 3 == 1) {
      return [this.getRow(), 2 * (this.getCol() - 1) / 3];
    } else {
      return [this.getRow(), 2 * (this.getCol() - 2) / 3 + 1];
    }
  };

  this.getLeftNodePosition = function() {
    if(this.getCol() % 3 == 0) {
      return [this.getRow() + 1, 2 * this.getCol() / 3 - 2];
    } else if(this.getCol() % 3 == 1) {
      return [this.getRow(), 2 * (this.getCol() - 1) / 3 - 1];
    } else {
      return [this.getRow(), 2 * (this.getCol() - 2) / 3];
    }
  };

  this.getNodePositions = function() {
    return [this.getLeftNodePosition(), this.getRightNodePosition()];
  };

  this.getNodes = function() {
    var board = this.getBoard();
    return $.map(this.getNodePositions(),
                 function(position) {
                   return board.getNode(position);
                 }
                );
  };

  // TODO: think about getSettlements(playerId) function
  this.hasSettlement = function(playerId) {
    return $.grep(this.getNodes(),
                  function(node) {
                    return node.getPlayerId() == playerId;
                  }
                 ).length != 0;
  };

  this.getLeftEdgePositions = function() {
    if(this.getCol() % 3 == 0) {
      return [[this.getRow() + 1, this.getCol() - 2],
              [this.getRow() + 1, this.getCol() - 1]];
    } else if(this.getCol() % 3 == 1) {
      return [[this.getRow(), this.getCol() - 2],
              [this.getRow(), this.getCol() - 1]];
    } else {
      return [[this.getRow() - 1, this.getCol() + 1],
              [this.getRow(), this.getCol() - 1]];
    }
  };

  this.getRightEdgePositions = function() {
    if(this.getCol() % 3 == 0) {
      return [[this.getRow(), this.getCol() + 1],
              [this.getRow(), this.getCol() - 1]];
    } else if(this.getCol() % 3 == 1) {
      return [[this.getRow() - 1, this.getCol() + 2],
              [this.getRow(), this.getCol() + 1]];
    } else {
      return [[this.getRow(), this.getCol() + 2],
              [this.getRow(), this.getCol() + 1]];
    }
  };

  this.getEdgePositions = function() {
    return [this.getLeftEdgePositions()[0],
            this.getLeftEdgePositions()[1],
            this.getRightEdgePositions()[0],
            this.getRightEdgePositions()[1]];
  };

  this.getEdges = function() {
    var board = this.getBoard();
    return $.map(this.getEdgePositions(),
                 function(edge) {
                   return board.getEdge(position);
                 }
                );
  };

  // TODO: conditions
  this.isValidForFirstRoad = function(playerId) {
    return !this.isSettled();
  };

  this.board = board;
  this.game = board.game;
  this.position = position;
};
