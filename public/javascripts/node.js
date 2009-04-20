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

Pioneers.Node = function(board, attributes) {
  this.getPosition = function() {
    return this.position;
  };

  this.getRow = function() {
    return this.position[0];
  };

  this.getCol = function() {
    return this.position[1];
  };

  this.getPlayerNumber = function() {
    return this.playerNumber;
  };

  this.getId = function() {
    return this.id;
  };

  this.getBoard = function() {
    return this.board;
  };

  this.getState = function() {
    return this.state;
  };

  this.isSettled = function() {
    return this.getPlayerNumber() != null;
  };

  this.setState = function(state) {
    this.state = state;
    $("#nodes li.row-" + this.getRow() + " li.col-" + this.getCol()).html("<div class='" + state + " player-" + this.getPlayerNumber() + "'></div>");
  };

  this.isSettlement = function(playerNumber) {
    if(playerNumber != undefined) {
      return this.state == "settlement" && this.getPlayerNumber() == playerNumber;
    } else {
      return this.state == "settlement";
    }
  };

  this.isCity = function(playerNumber) {
    if(playerNumber != undefined) {
      return this.state == "city" && this.getPlayerNumber() == playerNumber;
    } else {
      return this.state == "city";
    }
  };

  this.getHexPositions = function() {
    if(this.getCol() % 2 == 0) {
      return [[this.getRow() - 1, this.getCol() / 2],
              [this.getRow() - 1, this.getCol() / 2 - 1],
              [this.getRow(), this.getCol() / 2 - 1]];
    } else {
      return [[this.getRow() - 1, (this.getCol() - 1) / 2],
              [this.getRow(), (this.getCol() - 1) / 2 - 1],
              [this.getRow(), (this.getCol() - 1) / 2]];
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

  this.getNodePositions = function() {
    if(this.getCol() % 2 == 0) {
      return [[this.getRow() - 1, this.getCol() + 1],
              [this.getRow(), this.getCol() - 1],
              [this.getRow(), this.getCol() + 1]];
    } else {
      return [[this.getRow(), this.getCol() + 1],
              [this.getRow(), this.getCol() - 1],
              [this.getRow() + 1, this.getCol() - 1]];
    }
  };

  this.getNodes = function() {
    var board = this.getBoard();
    return $.map(this.getNodePositions(),
                 function(position) {
                   return board.getNode(position);
                 }
                );
  };

  this.hasSettlementInNeighbourhood = function() {
    return $.grep(this.getNodes(),
                  function(node) {
                    return node.isSettled();
                  }
                 ).length != 0;
  };

  this.getEdgePositions = function() {
    if(this.getCol() % 2 == 0) {
      return [[this.getRow() - 1, 3 * this.getCol() / 2 + 3],
              [this.getRow(), 3 * this.getCol() / 2 + 1],
              [this.getRow(), 3 * this.getCol() / 2 + 2]];
    } else {
      return [[this.getRow(), 3 * ((this.getCol() - 1) / 2 + 1) + 1],
              [this.getRow(), 3 * ((this.getCol() - 1) / 2 + 1) - 1],
              [this.getRow(), 3 * ((this.getCol() - 1) / 2 + 1)]];
    }
  };

  this.getEdges = function() {
    var board = this.getBoard();
    return $.map(this.getEdgePositions(),
                 function(position) {
                   return board.getEdge(position);
                 }
                );
  };

  this.getRoads = function(playerNumber) {
    return $.grep(this.getEdges(),
                  function(edge) {
                    return edge.getPlayerNumber() == playerNumber;
                  }
                 );
  };

  this.hasRoad = function(playerNumber) {
    return this.getRoads(playerNumber).length != 0;
  };

  this.isValidForFirstSettlement = function() {
    return !this.isSettled() && this.isSettleable() && !this.hasSettlementInNeighbourhood();
  };

  this.isValidForSecondSettlement = this.isValidForFirstSettlement;

  this.isValidForSettlement = function(playerNumber) {
    return !this.isSettled() && !this.hasSettlementInNeighbourhood() && this.hasRoad(playerNumber);
  };

  this.update = function(attributes) {
    this.id = attributes.id;
    this.playerNumber = attributes.playerNumber;
    if(this.state != attributes.state) this.setState(attributes.state);
  };

  this.board = board;
  this.game = board.game;
  this.position = attributes.position;
  this.id = attributes.id;
  this.playerNumber = attributes.playerNumber;
  this.state = attributes.state;
};
