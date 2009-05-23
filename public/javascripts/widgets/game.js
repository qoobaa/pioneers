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
        $(this.element).addClass("ui-widget ui-game");
        var that = this;
        var id = Pioneers.utils.getGameId();
        $.getJSON("/games/" + id + ".json", function(data) {
            that._gameDataLoaded(data);
        });
    },

    _gameDataLoaded: function(data) {
        var that = this;
        $.each(data.game, function(key, value) {
            that.options[key] = value;
        });

        this._createBoard(this.options.board);
        this._createGameinfo(this.options);
        this._createPlayers(this.options.players);
        var userPlayer = $.grep(this.options.players, function(player) {
            return player.number === that.options.userPlayer;
        })[0];
        this._createUserplayer(userPlayer);
        this._createBuild();
        this._createEndTurn();
        this._createRollDice();
        this._createDiscard();
        this._setupStomp();
        this._refresh();
    },

    _createBoard: function(boardAttributes) {
        var that = this;
        this.board = $("<div/>").appendTo(this.element).board({ boardAttributes: boardAttributes });

        this.board.bind("boardrobbed", function(event, position, player) {
            var data = {
                "robbery[row]": position[0],
                "robbery[col]": position[1]
            };
            if(player) {
                data["robbery[sender_number]"] =  player;
            }
            $.post("/games/" + that.options.id + "/robberies", data);
        });

        this.board.bind("boardsettlementbuilt", function(event, position) {
            var data = {
                "node[state_event]": "settle",
                "node[row]": position[0],
                "node[col]": position[1]
            };
            $.post("/games/" + that.options.id + "/nodes", data);
            that.build.build("enable");
        });

        this.board.bind("boardcitybuilt", function(event, id) {
            var data = {
                _method: "put",
                "node[state_event]": "expand"
            };
            $.post("/games/" + that.options.id + "/nodes/" + id, data);
            that.build.build("enable");
        });

        this.board.bind("boardroadbuilt", function(event, position) {
            var data = {
                "edge[row]": position[0],
                "edge[col]": position[1]
            };
            $.post("/games/" + that.options.id + "/edges", data);
            that.build.build("enable");
        });
    },

    _createGameinfo: function(gameAttributes) {
        this.gameinfo = $("<div/>").appendTo(this.element).gameinfo(gameAttributes);
    },

    _createPlayers: function(playersAttributes) {
        var that = this;
        $.each(playersAttributes, function() {
            that["player" + this.number] = $("<div/>").appendTo(that.element).player(this);
        });
    },

    _createUserplayer: function(userPlayerAttributes) {
        if(userPlayerAttributes != undefined) {
            this.userplayer = $("<div/>").appendTo(this.element).userplayer(userPlayerAttributes);
        }
    },

    _createBuild: function() {
        var that = this;
        this.build = $("<div/>").appendTo(this.element).build().hide();
        this.build.bind("buildsettlementclick", function(event) {
            that.build.build("disable");
            that.board.board("buildSettlementMode", that.options.userPlayer);
        });
        this.build.bind("buildcityclick", function() {
            that.build.build("disable");
            that.board.board("buildCityMode", that.options.userPlayer);
        });
        this.build.bind("buildroadclick", function() {
            that.build.build("disable");
            that.board.board("buildRoadMode", that.options.userPlayer);
        });
    },

    _createEndTurn: function() {
        var that = this;
        this.endTurn = $("<a/>").addClass("end-turn").text("End turn").attr("href", "").hide().appendTo(this.element).click(function() {
            var data = {
                _method : "put",
                "game[phase_event]": "end_turn"
            };
            $.post("/games/" + that.options.id, data);
            return false;
        });
    },

    _createRollDice: function() {
        var that = this;
        this.rollDice = $("<a/>").addClass("roll-dice").text("Roll dice").attr("href", "").hide().appendTo(this.element).click(function() {
            var data = {
                nothing: true // TODO: check Rack or RoR for the bug
            };
            $.post("/games/" + that.options.id + "/dice_rolls", data);
            return false;
        });
    },

    _createDiscard: function() {
        var that = this;
        this.discard = $("<div/>").hide().appendTo(this.element).discard(this.options.userPlayer).bind("discardaccept", function(event, bricks, grain, lumber, ore, wool) {
            var data = {
                "discard[bricks]": bricks,
                "discard[grain]": grain,
                "discard[lumber]": lumber,
                "discard[ore]": ore,
                "discard[wool]": wool
            };
            $.post("/games/" + that.options.id + "/discards", data);
        });
    },

    // STOMP part

    _setupStomp: function() {
        var that = this;
        document.domain = document.domain;
        Orbited.settings.hostname = "localhost";
        Orbited.settings.port = "8000";
        Orbited.settings.protocol = "http";
        Orbited.settings.streaming = true;
        TCPSocket = Orbited.TCPSocket;
        this.stomp = new STOMPClient();
        this.stomp.onconnectedframe = function(frame) {
            that._stompConnected(frame);
        };
        this.stomp.onmessageframe = function(frame) {
            that._stompMessageReceived(frame);
        };
        $(window).bind("beforeunload", function() {
            that.stomp.reset();
        });
        this.stomp.connect("localhost", "61613");
    },

    _stompConnected: function(frame) {
        this.stomp.subscribe(document.location.pathname);
    },

    _stompMessageReceived: function(frame) {
        // if(console && console.log) {
        //     console.log(frame.body);
        // }
        var message = eval("(" + frame.body + ")");
        var that = this;
        $.each(message, function(key, value) {
            that["_" + key + "Received"](value);
        });
        this._refresh();
    },

    // game: { cardPlayed: false, cards: 10, phase: "after_roll", player: 1, discardPlayer: 1, winner: null, state: "playing", roll: 7, turn: 21, players: [{ number: 1, resources: 2, points: 3, cards: 3, state: "started" }]}
    _gameReceived: function(game) {
        var that = this;
        this.gameinfo.gameinfo("update", game);
        $.each(game, function(key, value) {
            that.options[key] = value;
        });
    },

    // node: { position: [1, 1], id: 10, player: 1, state: "city" }
    _nodeReceived: function(node) {
        $(this.element).find(".board").board("nodeChanged", node);
    },

    // edge: { position: [2, 2], player: 1 }
    _edgeReceived: function(edge) {
        $(this.element).find(".board").board("edgeChanged", edge);
    },

    // robbery: { position: [1, 2], sender: 1, recipient: 2, bricks: 1, grain: 0, lumber: 0, ore: 0, wool: 0 }
    _robberyReceived: function(robbery) {
        $(this.element).find(".board").board("robberMoved", robbery);
    },

    // offer: { sender: 1, recipient: null, bricks: 0, grain: -1, lumber: 1, ore: 0, wool: 0, state: "awaiting" }
    _offerReceived: function(offer) {

    },

    // offerResponse: { player: 1, agreed: true }
    _offerResponseReceived: function(offerResponse) {

    },

    // exchange: { player: 1, bricks: 0, grain: -4, lumber: 1, ore: 0, wool: 0 }
    _exchangeReceived: function(exchange) {

    },

    // discard: { player: 1, bricks: 0, grain: -4, lumber: 0, ore: 0, wool: 0 }
    _discardReceived: function(discard) {

    },

    // card: { player: 1, id: 5, state: "tapped", bricks: 0, grain: 0, lumber: 0, ore: 0, wool: 0, resource: null, type: "Card" }
    _cardReceived: function(card) {

    },

    // refresh
    _refresh: function() {
        var that = this;

        // refresh players
        $.each(this.options.players, function() {
            that["player" + this.number].player("current", this.number === that.options.player).player("update", this);
        });

        if(this._isUserDiscard()) {
            this.discard.discard("limit", this.options.discardLimit);
            this.discard.show();
        } else {
            this.discard.hide();
        }

        if(this._isUserBeforeRoll()) {
            this.rollDice.show();
        } else {
            this.rollDice.hide();
        }

        if(this._isUserAfterRoll()) {
            this.endTurn.show();
            this.build.show();
        } else {
            this.endTurn.hide();
            this.build.hide();
        }

        if(this._isUserRobber()) {
            this.board.board("moveRobberMode", this.options.userPlayer);
        }
    },

    // helpers
    _isUserPhase: function() {
        return this.options.userPlayer === this.options.player;
    },

    _isUserBeforeRoll: function() {
        return this._isUserPhase() && this.options.phase === "before_roll";
    },

    _isUserAfterRoll: function() {
        return this._isUserPhase() && this.options.phase === "after_roll";
    },

    _isUserRobber: function() {
        return this._isUserPhase() && this.options.phase === "robber";
    },

    _isUserDiscard: function() {
        return this.options.userPlayer === this.options.discardPlayer
            && this.options.phase === "discard";
    }
});
