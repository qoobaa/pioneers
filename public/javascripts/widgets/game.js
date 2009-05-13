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
    this._setId(data.game.id);
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
    var that = this;
    var board = $("<div/>").appendTo(this.element).board({ boardAttributes: boardAttributes });

    board.bind("boardRobbed", function(event, position, playerNumber) {
      var data = {
        "robbery[row]": position[0],
        "robbery[col]": position[1],
        "robbery[player_number]": playerNumber
      };
      $.post("/games/" + that._getId() + "/robberies", data);
    });

    board.bind("boardSettlementBuilt", function(event, position) {
      var data = {
        "node[row]": position[0],
        "node[col]": position[1]
      };
      $.post("/games/" + that._getId() + "/nodes", data);
      $(this.element).find(".build").build("enable");
    });

    board.bind("boardCityBuilt", function(event, id) {
      var data = {
        _method: "put",
        "node[state_event]": "expand"
      };
      $.post("/games/" + that._getId() + "/nodes/" + id, data);
      $(this.element).find(".build").build("enable");
    });

    board.bind("boardRoadBuilt", function(event, position) {
      var data = {
        "edge[row]": position[0],
        "edge[col]": position[1]
      };
      $.post("/games/" + that._getId() + "/edges", data);
      $(this.element).find(".build").build("enable");
    });
  },

  _createGameInfo: function(gameAttributes) {
    $("<div/>").appendTo(this.element).gameInfo(gameAttributes);
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
      this._setUserPlayerNumber(userPlayerAttributes.playerNumber);
    }
  },

  _createBuild: function() {
    var that = this;
    var build = $("<div/>").appendTo(this.element).build();
    build.bind("buildSettlement", function(event) {
      build.build("disable");
      $(that.element).find(".board").board("buildSettlementMode", 1);
    });
    build.bind("buildCity", function() {
      build.build("disable");
      $(that.element).find(".board").board("buildCityMode", 1);
    });
    build.bind("buildRoad", function() {
      build.build("disable");
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
    stomp = new STOMPClient();
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
    var message = eval("(" + frame.body + ")");
    this["_" + message.event](message);
    return undefined;
    switch(message.event) {
    case "robberMoved":
      // { event: "robberyCreated", hex: { position: [3, 3] }, robbery: { sender: 1, recipient: 2, bricks: 1, grain: 0, lumber: 0, ore: 0, wool: 0 }, game: { phase: "after_roll" } }
      $(this.element).find(".board").board("robberMoved", message.hex);
      break;
    case "diceRolled":
      // { event: "diceRolled", game: { phase: "discard", discardPlayer: 1, roll: 7 } }
      break;
    case "turnEnded":
      // { event: "turnEnded", game: { phase: "before_roll", player: 1, turn: 21 } }
      break;
    case "offerCreated":
      // { event: "offerCreated", offer: { player: 1, bricks: 0, grain: -1, lumber: 1, ore: 0, wool: 0 }, game: { phase: "offer" } }
      break;
    case "offerCancelled":
      // { event: "offerExpired", game: { phase: "after_roll" } }
      break;
    case "offerAgreed":
      // { event: "offerAgreed", offer: { sender: 1, recipient: 2, bricks: 0, grain: -1, lumber: 1, ore: 0, wool: 0 }, game: { phase: "after_roll" } }
      break;
    case "responseCreated":
      // { event: "responseCreated", response: { player: 1, agreed: true } }
      break;
    case "exchanged":
      // { event: "exchanged", exchange: { player: 1, bricks: 0, grain: -4, lumber: 1, ore: 0, wool: 0 } }
      break;
    case "discarded":
      // { event: "discarded", discard: { player: 1, bricks: 0, grain: -4, lumber: 0, ore: 0, wool: 0 } }
      break;
    case "cardBought":
      // { event: "cardBought", card: { player: 1, id: 5 } }
      break;
    case "cardPlayed":
      // { event: "cardPlayed", card: { player: 1, id: 5 }, game: { phase: "robber" } }
      break;
    case "playerCreated":
      // { event: "playerCreated", player: { number: 2, name: "joe" } }
      break;
    case "playerStarted":
      // { event: "playerStarted", player: { number: 2 } }
      break;
    }
  },

  // stomp events actions
  _settlementBuilt: function(event) {
    // { event: "settlementBuilt", node: { position: [3, 3], id: 10, player: 1 }, game: { phase: "after_roll", state: "playing", winner: null }, player: { number: 1, resources: 2, points: 4 } }
    $(this.element).find(".board").board("settlementBuilt", event.node);
  },

  _cityBuilt: function(event) {
    // { event: "cityBuilt", node: { position: [3, 3] }, game: { state: "playing", winner: null }, player: { number: 1, resources: 0, points: 5 } }
    $(this.element).find(".board").board("cityBuilt", event.node);
  },

  _roadBuilt: function(event) {
    // { event: "roadBuilt", edge: { position: [3, 3], player: 1 }, game: { phase: "after_roll", player: 1, winner: null }, player: { number: 1, resources: 0, points: 6 } }
    $(this.element).find(".board").board("roadBuilt", event.edge);
  },

  // getters and setters

  _setId: function(id) {
    this._setData("id", id);
  },

  _getId: function() {
    return this._getData("id");
  },

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
    $(".build").hide();
    switch(phase) {
    case "after_roll":
      if(this._getUserPlayerNumber() === this._getPlayerNumber()) {
        $(".build").show();
      }
      break;
    }
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

  _getPlayerNumber: function() {
    return this._getData("playerNumber");
  },

  _setPlayerNumber: function(playerNumber) {
    this._setData("playerNumber", playerNumber);
  },

  _getUserPlayerNumber: function() {
    return this._getData("userPlayerNumber");
  },

  _setUserPlayerNumber: function(userPlayerNumber) {
    this._setData("userPlayerNumber", userPlayerNumber);
  },

  _setStomp: function(stomp) {
    this._setData("stomp", stomp);
  },

  _getStomp: function() {
    return this._getData("stomp");
  }
});
