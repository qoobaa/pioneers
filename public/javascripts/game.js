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

  this.playerById = function(id) {
    return $.grep(this.players,
                  function(player) {
                    return player.id == id;
                  }
                 )[0];
  };

  this.buildCity = function() {
    var playerNumber = this.userPlayer.number;
    $.each(this.map.settlements(),
           function() {
             var id = this.id;
             $("#nodes li.row-" + this.row() + " li.col-" + this.col()).addClass("expandable").hover(
               function() {
                 $(this).html("<div class='city player-" + playerNumber + "'></div>");
               },
               function() {
                 $(this).html("<div class='settlement player-" + playerNumber + "'></div>");
               }
             ).click(
               function() {
                 alert("you clicked " + id);
                 $("#nodes .expandable").removeClass("expandable").unbind();
               }
             );
           }
          );
  };

  this.buildSettlement = function() {
    var playerNumber = this.userPlayer.number;
    var map = this.map;
    var nodes = [];
    $.each(this.map.roads(), function() {
             $.each(this.nodePositions(), function() {
                      if(map.nodes[this[0]][this[1]] == null) {
                        var node = new Pioneers.Node(map, { position: this });
                        if(node.nodes().length == 0) {
                          $("#nodes li.row-" + node.row() + " li.col-" + node.col()).addClass("settleable").hover(
                            function() {
                              $(this).html("<div class='settlement player-" + playerNumber + "'></div>");
                            },
                            function() {
                              $(this).empty();
                            }
                          ).click(
                            function() {
                              alert("you clicked " + node.row() + ", " + node.col());
                              $("#nodes .settleable").removeClass("settleable").unbind().empty();
                            }
                          );
                        };
                      }
                    }
                   );
           }
          );
  };

  this.id = attributes.id;
  this.createMap(attributes.map);
  this.createUserPlayer(attributes.userPlayer);
  this.createPlayers(attributes.players);
};
