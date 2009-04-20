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
  this.createBoard = function(attributes) {
    this.board = new Pioneers.Board(this, attributes);
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

  this.getPlayers = function() {
    return this.players;
  };

  this.getPlayer = function(playerId) {
    return $.grep(this.getPlayers(),
                  function(player) {
                    return player.getId() == playerId;
                  }
                 )[0];
  };

  this.getPlayerNumber = function(playerId) {
    return this.getPlayer(playerId).getNumber();
  };

  this.updateBoard = function(attributes) {
    var game = this;
    this.board.update(attributes);
  };

  this.updateUserPlayer = function(attributes) {
    if(this.userPlayer != null) {
      this.userPlayer.update(attributes);
    }
  };

  this.updatePlayers = function(attributes) {
    $.each(this.getPlayers(),
           function(i) {
             this.update(attributes[i]);
           }
          );
  };

  this.update = function(attributes) {
    this.updateBoard(attributes.board);
    this.updatePlayers(attributes.players);
    this.updateUserPlayer(attributes.userPlayer);
  };

  this.id = attributes.id;
  this.createBoard(attributes.board);
  $("#board").board({ board: this.board });
  this.createPlayers(attributes.players);
  this.createUserPlayer(attributes.userPlayer);
};
