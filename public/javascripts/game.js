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
  this.createMap = function(attributes) {
    this.map = new Pioneers.Map(this, attributes);
    this.map.game = this;
  };

  this.createUserPlayer = function(attributes) {
    if(attributes != null) {
      this.userPlayer = new Pioneers.UserPlayer(this, attributes);
    }
  };

  this.createPlayers = function(attributes) {
    var game = this;
    this.players = $.map(attributes,
                         function(player) {
                           return new Pioneers.Player(game, player);
                         }
                        );
  };

  this.updateMap = function(attributes) {
    this.map.update(attributes);
  };

  this.updateUserPlayer = function(attributes) {
    if(this.userPlayer != null) {
      this.userPlayer.update(attributes);
    }
  };

  this.updatePlayers = function(attributes) {
    $.each(this.players,
           function(i) {
             this.update(attributes[i]);
           }
          );
  };

  this.update = function(attributes) {
    this.updateMap(attributes.map);
    this.updatePlayers(attributes.players);
    this.updateUserPlayer(attributes.userPlayer);
  };

  this.id = attributes.id;
  this.createMap(attributes.map);
  this.createUserPlayer(attributes.userPlayer);
  this.createPlayers(attributes.players);
};
