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
    this._createGameInfo();
    this._createPlayers(data.game.players);
    this._createUserPlayer(data.game.userPlayer);
    this._setupStomp();
  },

  _createBoard: function(boardAttributes) {
    $("<div/>").appendTo(this.element).board({ boardAttributes: boardAttributes });
  },

  _createGameInfo: function() {
    var gameDl = $("<dl/>").appendTo(this.element);
    $("<dt/>").appendTo(gameDl).text("State");
    $("<dd/>").appendTo(gameDl).addClass("state");
    $("<dt/>").appendTo(gameDl).text("Phase");
    $("<dd/>").appendTo(gameDl).addClass("phase");
    $("<dt/>").appendTo(gameDl).text("Turn");
    $("<dd/>").appendTo(gameDl).addClass("turn");
    $("<dt/>").appendTo(gameDl).text("Roll");
    $("<dd/>").appendTo(gameDl).addClass("roll");
    this._refreshState();
    this._refreshPhase();
    this._refreshTurn();
    this._refreshRoll();
  },

  _refreshState: function(highlight) {
    var state = $(this.element).find("dd.state").text(this._getState());
    if(highlight) state.effect("highlight");
  },

  _refreshPhase: function(highlight) {
    var phase = $(this.element).find("dd.phase").text(this._getPhase());
    if(highlight) phase.effect("highlight");
  },

  _refreshTurn: function(highlight) {
    var turn = $(this.element).find("dd.turn").text(this._getTurn());
    if(highlight) turn.effect("highlight");
  },

  _refreshRoll: function(highlight) {
    var roll = $(this.element).find("dd.roll").text(this._getRoll());
    if(highlight) roll.effect("highlight");
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
