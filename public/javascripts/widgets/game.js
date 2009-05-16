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
        this._setPlayer(data.game.player);
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

        board.bind("boardRobbed", function(event, position, player) {
            var data = {
                "robbery[row]": position[0],
                "robbery[col]": position[1]
            };
            if(player) {
                data["robbery[sender_number]"] =  player;
            }
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
            this._setUserPlayer(userPlayerAttributes.player);
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
        var that = this;
        $.each(message, function(key, value) {
            that["_" + key + "Update"](value);
        });
    },

    // game: { cardPlayed: false, cards: 10, phase: "after_roll", player: 1, discardPlayer: 1, winner: null, state: "playing", roll: 7, turn: 21, players: [{ number: 1, resources: 2, points: 3, cards: 3, state: "started" }]}
    _gameUpdate: function(game) {
        this._setCards(game.cards);
        this._setPhase(game.phase);
        this._setPlayer(game.player);
        this._setDiscardPlayer(game.player);
        this._setWinner(game.winner);
        this._setState(game.state);
        this._setRoll(game.roll);
        this._setTurn(game.turn);
        this._playersUpdate(game.players);
    },

    _playersUpdate: function(players) {

    },

    // node: { position: [1, 1], id: 10, player: 1, state: "city" }

    _nodeUpdate: function(node) {

    },

    // edge: { position: [2, 2], player: 1 }

    _edgeUpdate: function(edge) {

    },

    // robbery: { position: [1, 2], sender: 1, recipient: 2, bricks: 1, grain: 0, lumber: 0, ore: 0, wool: 0 }

    _robberyUpdate: function(robbery) {

    },

    // offer: { sender: 1, recipient: null, bricks: 0, grain: -1, lumber: 1, ore: 0, wool: 0 }

    _offerUpdate: function(offer) {

    },

    // response: { player: 1, agreed: true }

    _offerResponseUpdate: function(offerResponse) {

    },

    // exchange: { player: 1, bricks: 0, grain: -4, lumber: 1, ore: 0, wool: 0 }

    _exchangeUpdate: function(exchange) {

    },

    // discard: { player: 1, bricks: 0, grain: -4, lumber: 0, ore: 0, wool: 0 }

    _discardUpdate: function(discard) {

    },

    // card: { player: 1, id: 5, state: "tapped", bricks: 0, grain: 0, lumber: 0, ore: 0, wool: 0, resource: null, type: "Card" }

    _cardUpdate: function(card) {

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

    _setWinner: function(winner) {
        this._setData("winner", winner);
    },

    _getWinner: function() {
        return this._getData("winner");
    },

    _setPhase: function(phase) {
        this._setData("phase", phase);
        $(".build").hide();
        switch(phase) {
        case "after_roll":
            if(this._getUserPlayer() === this._getPlayer()) {
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

    _setDiscardPlayer: function(discardPlayer) {
        this._setData("discardPlayer", discardPlayer);
    },

    _getDiscardPlayer: function() {
        return this._getData("discardPlayer");
    },

    _setCardPlayed: function(cardPlayed) {
        this._setData("cardPlayed", cardPlayed);
    },

    _getPlayer: function() {
        return this._getData("player");
    },

    _setPlayer: function(player) {
        this._setData("player", player);
    },

    _getUserPlayer: function() {
        return this._getData("userPlayer");
    },

    _setUserPlayer: function(userPlayer) {
        this._setData("userPlayer", userPlayer);
    },

    _setStomp: function(stomp) {
        this._setData("stomp", stomp);
    },

    _getStomp: function() {
        return this._getData("stomp");
    }
});
