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

Pioneers.Game = function(attributes) {
  this.id = attributes.id;
  this.map = new Pioneers.Map(attributes.map);
  this.map.game = this;
  this.userPlayer = new Pioneers.UserPlayer(attributes.userPlayer);

  this.createPlayers = function(attributes) {
    var players = [];
    for(i in attributes) {
      players[i] = new Pioneers.Player(attributes[i]);
    }
    return players;
  };

  this.players = this.createPlayers(attributes.players);

  this.update = function(attributes) {
    this.userPlayer.update(attributes.userPlayer);
    this.map.update(attributes.map);
  };
};
