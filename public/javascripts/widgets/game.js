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
    var gameWidget = this;
    $.getJSON("/games/" + Pioneers.utils.getGameId() + ".json", function(data) {
      gameWidget._gameDataLoaded(data);
    });
  },

  _gameDataLoaded: function(data) {
    $("<div/>").appendTo(this.element).board({ boardAttributes: data.game.board });
    this._setupStomp();
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

  _setStomp: function(stomp) {
    this._setData("stomp", stomp);
  },

  _getStomp: function() {
    return this._getData("stomp");
  }
});
