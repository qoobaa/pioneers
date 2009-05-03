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

$.widget("ui.game", {
  _init: function() {
    $(this.element).addClass("game");
    var gameWidget = this;
    $.getJSON("/games/" + Pioneers.utils.getGameId() + ".json", function(data) {
      gameWidget._gameDataLoaded(data);
    });
  },

  _gameDataLoaded: function(data) {
    this._setState(data.game.state);
    this._setPhase(data.game.phase);
    this._setCards(data.game.cards);
    this._setTurn(data.game.turn);
    this._setRoll(data.game.roll);
    this._setCardPlayed(data.game.cardPlayed);
    this._setPlayerNumber(data.game.playerNumber);
    this._createBoard(data.game.board);
    this._createGameInfo(data.game);
    this._createPlayers(data.game.players);
    this._createUserPlayer(data.game.userPlayer);
    this._createBuild();
    this._setupStomp();
  },

  _createBoard: function(boardAttributes) {
    var board = $("<div/>").appendTo(this.element).board({ boardAttributes: boardAttributes });

    board.bind("boardRobbed", function(event, position, playerNumber) {
      var data = {
        "robbery[row]": position[0],
        "robbery[col]": position[1],
        "robbery[player_number]": playerNumber
      };
      $.post("/games/" + Pioneers.utils.getGameId() + "/robberies", data);
    });

    board.bind("boardSettlementBuilt", function(event, position) {
      var data = {
        "node[row]": position[0],
        "node[col]": position[1]
      };
      $.post("/games/" + Pioneers.utils.getGameId() + "/nodes", data);
      $(this.element).find(".build").build("enable");
    });

    board.bind("boardCityBuilt", function(event, id) {
      var data = {
        _method: "put",
        "node[state_event]": "expand"
      };
      $.post("/games/" + Pioneers.utils.getGameId() + "/nodes/" + id, data);
      $(this.element).find(".build").build("enable");
    });

    board.bind("boardRoadBuilt", function(event, position) {
      var data = {
        "edge[row]": position[0],
        "edge[col]": position[1]
      };
      $.post("/games/" + Pioneers.utils.getGameId() + "/edges", data);
      $(this.element).find(".build").build("enable");
    });
  },

  _createGameInfo: function(gameAttributes) {
    // TODO
  },

  _createPlayers: function(playersAttributes) {
    var gameWidget = this;
    $.each(playersAttributes, function() {
      $("<div/>").appendTo(gameWidget.element).player(this);
    });
  },

  _createUserPlayer: function(userPlayerAttributes) {
    if(userPlayerAttributes != undefined) {
      $("<div/>").appendTo(this.element).userPlayer(userPlayerAttributes);
    }
  },

  _createBuild: function() {
    var that = this;
    var build = $("<div/>").appendTo(this.element).build();
    build.bind("buildSettlement", function(event) {
      $(this).build("disable");
      $(that.element).find(".board").board("buildSettlementMode", 1);
    });
    build.bind("buildCity", function() {
      $(this).build("disable");
      $(that.element).find(".board").board("buildCityMode", 1);
    });
    build.bind("buildRoad", function() {
      $(this).build("disable");
      $(that.element).find(".board").board("buildRoadMode", 1);
    });
  },

  // STOMP part

  _setupStomp: function() {
    var gameWidget = this;
    document.domain = document.domain;
    Orbited.settings.hostname = "localhost";
    Orbited.settings.port = "8000";
    Orbited.settings.protocol = "http";
    Orbited.settings.streaming = true;
    TCPSocket = Orbited.TCPSocket;
    var stomp = new STOMPClient();
    this._setStomp(stomp);
    stomp.onconnectedframe = function(frame) {
      gameWidget._stompConnected(frame);
    };
    stomp.onmessageframe = function(frame) {
      gameWidget._stompMessageReceived(frame);
    };
    $(window).bind("beforeunload", function() {
      stomp.reset();
    });
    stomp.connect("localhost", "61613");
  },

  _stompConnected: function(frame) {
    this._getStomp().subscribe(document.location.pathname);
  },

  _stompMessageReceived: function(frame) {
    console.log(frame.body);
  },

  // getters and setters

  _setCards: function(cards) {
    this._setData("cards", cards);
  },

  _getCards: function() {
    return this._getData("cards");
  },

  _setRoll: function(roll) {
    this._setData("roll", roll);
  },

  _getRoll: function() {
    return this._getData("roll");
  },

  _setState: function(state) {
    this._setData("state", state);
  },

  _getState: function() {
    return this._getData("state");
  },

  _setPhase: function(phase) {
    this._setData("phase", phase);
  },

  _getPhase: function() {
    return this._getData("phase");
  },

  _setTurn: function(turn) {
    this._setData("turn", turn);
  },

  _getTurn: function() {
    return this._getData("turn");
  },

  _setCardPlayed: function(cardPlayed) {
    this._setData("cardPlayed", cardPlayed);
  },

  _setPlayerNumber: function(playerNumber) {
    this._setData("playerNumber", playerNumber);
  },

  _setStomp: function(stomp) {
    this._setData("stomp", stomp);
  },

  _getStomp: function() {
    return this._getData("stomp");
  }
});
