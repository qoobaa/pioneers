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

Pioneers.Node = function(attributes) {
  this.position = attributes.position;
  this.playerId = attributes.playerId;
  this.state = attributes.state;

  this.row = function() {
    return this.position[0];
  };

  this.col = function() {
    return this.position[1];
  };

  this.hexPositions = function() {
    if(this.col() % 2 == 0) {
      return [[this.row() - 1, this.col() / 2],
              [this.row(), this.col() / 2 - 1],
              [this.row(), this.col() / 2]];
    } else {
      return [[this.row() - 1, (this.col() - 1) / 2],
              [this.row(), (this.col() - 1) / 2 - 1],
              [this.row(), (this.col() - 1) / 2]];
    }
  };

  this.nodePositions = function() {
    if(this.col() % 2 == 0) {
      return [[this.row() - 1, this.col() + 1],
              [this.row(), this.col() - 1],
              [this.row(), this.col() + 1]];
    } else {
      return [[this.row(), this.col() + 1],
              [this.row(), this.col() - 1],
              [this.row() + 1, this.col() - 1]];
    }
  };

  this.edgePositions = function() {
    if(this.col() % 2 == 0) {
      return [[this.row() - 1, 3 * this.col() / 2 + 3],
              [this.row(), 3 * this.col() / 2 + 1],
              [this.row(), 3 * this.col() / 2 + 2]];
    } else {
      return [[this.row(), 3 * ((this.col() - 1) / 2 + 1) + 1],
              [this.row(), 3 * ((this.col() - 1) / 2 + 1) - 1],
              [this.row(), 3 * ((this.col() - 1) / 2 + 1)]];
    }
  };

  this.update = function(attributes) {
    this.state = attributes.state;
    this.updateView();
  };

  this.updateView = function() {
    $("#nodes li.row-" + this.row() + " li.col-" + this.col()).html("<div class='" + this.state + " player-" + this.playerNumber() + "'></div>");
  };

  this.game = function() {
    return this.map.game;
  };

  this.playerNumber = function() {
    var players = this.game().players;
    for(i in players) {
      if(players[i].id == this.playerId) return players[i].number;
    }
  };
};
