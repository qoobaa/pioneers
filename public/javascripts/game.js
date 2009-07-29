// Pioneers - web game based on the Settlers of Catan board game.

// Copyright (C) 2009 Jakub Kuźma <qoobaa@gmail.com>

// This program is free software: you can redistribute it and/or
// modify it under the terms of the GNU Affero General Public License
// as published by the Free Software Foundation, either version 3 of
// the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public
// License along with this program.  If not, see
// <http://www.gnu.org/licenses/>.

YUI.add("game", function(Y) {

    var GAME = "game",
        ROLL = "roll",
        CARD = "card",
        ROAD = "road",
        SETTLEMENT = "settlement",
        CITY = "city",
        EXCHANGE = "exchange",
        DISCARD = "discard",
        OFFER = "offer",
        ROBBER = "robber",
        END_TURN = "end-turn",
        getCN = Y.ClassNameManager.getClassName,
        C_GAME = getCN(GAME),
        CONTENT_BOX = "contentBox",
        DIV_TEMPLATE = '<div></div>',
        Widget = Y.Widget,
        Node = Y.Node,
        bind = Y.bind,
        isValue = Y.Lang.isValue,
        io = Y.io,
        later = Y.later,
        parse = Y.JSON.parse,
        pioneers = Y.namespace("pioneers"),
        TIMEOUT = 10000;

    function Game() {
        Game.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Game, {
        NAME: GAME,
        ATTRS: {
            game: {
                writeOnce: true
            }
        }
    });

    Y.extend(Game, Widget, {
        renderUI: function() {
            this._renderBoard();
            this._renderExchange();
            this._renderDiscard();
            this._renderOffer();
            this._renderBuild();
            this._renderCards();
            this._renderBeforeRoll();
            this._renderAfterRoll();
        },

        _renderBoard: function() {
            var game = this.get("game"),
                board = game.board,
                player = game.get("userPlayer"),
                contentBox = this.get(CONTENT_BOX),
                boardNode = Node.create(DIV_TEMPLATE);

            this.board = new Y.Board({ contentBox: boardNode, game: game });
            contentBox.append(boardNode);

            this.board.render();
        },

        _renderExchange: function() {
            var game = this.get("game"),
                player = game.get("userPlayer"),
                contentBox = this.get(CONTENT_BOX),
                exchangeNode = Node.create(DIV_TEMPLATE);

            if(isValue(player)) {
                this.exchange = new Y.Exchange({ contentBox: exchangeNode, game: game });
                contentBox.append(exchangeNode);

                this.exchange.render();
            }
        },

        _renderDiscard: function() {
            var game = this.get("game"),
                player = game.get("userPlayer"),
                contentBox = this.get(CONTENT_BOX),
                discardNode = Node.create(DIV_TEMPLATE);

            if(isValue(player)) {
                this.discard = new Y.Discard({ contentBox: discardNode, game: game });
                contentBox.append(discardNode);

                this.discard.render();
            }
        },

        _renderOffer: function() {
            var game = this.get("game"),
                player = game.get("userPlayer"),
                contentBox = this.get(CONTENT_BOX),
                offerNode = Node.create(DIV_TEMPLATE);

            if(isValue(player)) {
                this.offer = new Y.Offer({ contentBox: offerNode, game: game });
                contentBox.append(offerNode);

                this.offer.render();
            }
        },

        _renderBuild: function() {
            var game = this.get("game"),
                player = game.get("userPlayer"),
                contentBox = this.get(CONTENT_BOX),
                buildNode = Node.create(DIV_TEMPLATE);

            if(isValue(player)) {
                this.build = new Y.Build({ contentBox: buildNode, game: game });
                contentBox.append(buildNode);

                this.build.render();
            }
        },

        _renderCards: function() {
            var game = this.get("game"),
                player = game.get("userPlayer"),
                cards = game.get("userCards"),
                contentBox = this.get(CONTENT_BOX),
                cardsNode = Node.create(DIV_TEMPLATE);

            if(isValue(player)) {
                this.cards = new Y.Cards({ contentBox: cardsNode, game: game });
                contentBox.append(cardsNode);

                this.cards.render();
            }
        },

        _renderBeforeRoll: function() {
            var game = this.get("game"),
                player = game.get("userPlayer"),
                cards = game.get("userCards"),
                contentBox = this.get(CONTENT_BOX),
                beforeRollNode = Node.create(DIV_TEMPLATE);

            if(isValue(player)) {
                this.beforeRoll = new Y.BeforeRoll({ contentBox: beforeRollNode, game: game });
                contentBox.append(beforeRollNode);

                this.beforeRoll.render();
            }
        },

        _renderAfterRoll: function() {
            var game = this.get("game"),
                player = game.get("userPlayer"),
                contentBox = this.get(CONTENT_BOX),
                afterRollNode = Node.create(DIV_TEMPLATE);

            if(isValue(player)) {
                this.afterRoll = new Y.AfterRoll({ contentBox: afterRollNode });
                contentBox.append(afterRollNode);

                this.afterRoll.render();
            }
        },

        syncUI: function() {
            var game = this.get("game"),
                player = game.get("userPlayer");

            if(isValue(player)) {
                this._uiSyncBoard();
                this._uiSyncOffer();
                this._uiSyncExchange();
                this._uiSyncDiscard();
                this._uiSyncBuild();
                this._uiSyncCards();
                this._uiSyncBeforeRoll();
                this._uiSyncAfterRoll();
            }

            if(this.timer) {
                this.timer.cancel();
            }
            this.timer = later(TIMEOUT, this, bind(this._refreshGame, this));
        },

        _complete: function(id, response) {
            var gameAttributes = parse(response.responseText),
                game = this.get("game");

            game.setAttrs(gameAttributes.game);
            this.syncUI();
        },

        _refreshGame: function() {
            var uri = "/games/1.json";
            io(uri);
        },

        _uiSyncBoard: function() {
            var game = this.get("game");

            this.board.syncUI();
            if(game.isUserRobber()) {
                this.board.set("mode", "robber");
            }
        },

        _uiSyncOffer: function() {
            var game = this.get("game");

            this.offer.syncUI();
            if(game.isUserAfterRoll()) {
                this.offer.show();
            } else {
                this.offer.hide();
            }
        },

        _uiSyncExchange: function() {
            var game = this.get("game");

            this.exchange.syncUI();
            if(game.isUserAfterRoll()) {
                this.exchange.show();
            } else {
                this.exchange.hide();
            }
        },

        _uiSyncBuild: function() {
            var game = this.get("game");

            this.build.syncUI();
            if(game.isUserAfterRoll()) {
                this.build.show();
            } else {
                this.build.hide();
            }
        },

        _uiSyncDiscard: function() {
            var game = this.get("game");

            this.discard.syncUI();
            if(game.isUserDiscard()) {
                this.discard.show();
            } else {
                this.discard.hide();
            }
        },

        _uiSyncCards: function() {
            var game = this.get("game");

            this.cards.syncUI();
            if(game.isUserAfterRoll() || game.isUserBeforeRoll()) {
                this.cards.show();
            } else {
                this.cards.hide();
            }
        },

        _uiSyncBeforeRoll: function() {
            var game = this.get("game");

            this.beforeRoll.syncUI();
            if(game.isUserBeforeRoll()) {
                this.beforeRoll.show();
            } else {
                this.beforeRoll.hide();
            }
        },

        _uiSyncAfterRoll: function() {
            var game = this.get("game");

            this.afterRoll.syncUI();
            if(game.isUserAfterRoll()) {
                this.afterRoll.show();
            } else {
                this.afterRoll.hide();
            }
        },

        bindUI: function() {
            var game = this.get("game"),
                player = game.get("userPlayer");

            if(isValue(player)) {
                this.beforeRoll.after(ROLL, bind(this._afterRoll, this));
                this.afterRoll.after(END_TURN, bind(this._afterEndTurn, this));
                this.cards.after(CARD, bind(this._afterCardPlay, this));
                this.board.after(ROAD, bind(this._afterRoadBuilt, this));
                this.board.after(SETTLEMENT, bind(this._afterSettlementBuilt, this));
                this.board.after(CITY, bind(this._afterCityBuilt, this));
                this.board.after(ROBBER, bind(this._afterRobberMoved, this));
                this.build.after(ROAD, bind(this._afterBuildRoad, this));
                this.build.after(SETTLEMENT, bind(this._afterBuildSettlement, this));
                this.build.after(CITY, bind(this._afterBuildCity, this));
                this.build.after(CARD, bind(this._afterBuildCard, this));
                this.exchange.after(EXCHANGE, bind(this._afterExchange, this));
                this.offer.after(OFFER, bind(this._afterOffer, this));
                this.discard.after(DISCARD, bind(this._afterDiscard, this));
            }

            Y.on("io:complete", bind(this._complete, this));
        },

        _afterRoll: function(event) {
            this._io("post", "/dice_rolls");
        },

        _afterEndTurn: function(event) {
            this._io("put", "", ["game[phase_event]=end_turn"]);
        },

        _afterCardPlay: function(event) {
            console.log(event);
            var details = event.details[0],
                id = details.id,
                resourceType = details.resourceType,
                bricks = details.bricks,
                grain = details.grain,
                lumber = details.lumber,
                ore = details.ore,
                wool = details.wool,
                params = [];

            params.push("card[state_event]=play");

            if(isValue(resourceType)) {
                params.push("card[resource_type]=" + resourceType);
            }

            if(isValue(bricks)) {
                params.push("card[bricks]=" + bricks);
            }

            if(isValue(grain)) {
                params.push("card[grain]=" + grain);
            }

            if(isValue(lumber)) {
                params.push("card[lumber]=" + lumber);
            }

            if(isValue(ore)) {
                params.push("card[ore]=" + ore);
            }

            if(isValue(wool)) {
                params.push("card[wool]=" + wool);
            }

            this._io("put", "/cards/" + id, params);
        },

        _afterBuildRoad: function(event) {
            this.board.set("mode", ROAD);
        },

        _afterBuildSettlement: function(event) {
            this.board.set("mode", SETTLEMENT);
        },

        _afterBuildCity: function(event) {
            this.board.set("mode", CITY);
        },

        _afterBuildCard: function(event) {
            this._io("post", "/cards");
        },

        _afterExchange: function(event) {
            // console.log(exchange);
        },

        _afterOffer: function(event) {
            // console.log(event);
        },

        _afterRoadBuilt: function(event) {
            var position = event.details[0],
                params = [
                    "edge[row]=" + position[0],
                    "edge[col]=" + position[1],
                    "edge[state_event]=settle"
                ];

            this._io("post", "/edges", params);
        },

        _afterSettlementBuilt: function(event) {
            var position = event.details[0],
                params = [
                    "node[row]=" + position[0],
                    "node[col]=" + position[1],
                    "node[state_event]=settle"
                ];

            this._io("post", "/nodes", params);
        },

        _afterCityBuilt: function(event) {
            var position = event.details[0];

            this._io("put", "/nodes/" + position.join(","), ["node[state_event]=expand"]);
        },

        _afterRobberMoved: function(event) {
            var position = event.details[0],
                player = event.details[1],
                params = [];

            params.push("robbery[row]=" + position[0]);
            params.push("robbery[col]=" + position[1]);

            if(isValue(player)) {
                params.push("robbery[sender_number]=" + player);
            }

            this._io("post", "/robberies", params);
        },

        _afterDiscard: function(event) {
            var details = event.details[0],
                params = [
                    "discard[bricks]=" + details.bricks,
                    "discard[grain]=" + details.grain,
                    "discard[lumber]=" + details.lumber,
                    "discard[ore]=" + details.ore,
                    "discard[wool]=" + details.wool
                ];

            this._io("post", "/discards", params);
        },

        _io: function(method, path, params) {
            var timer = this.timer,
                game = this.get("game"),
                id = game.get("id"),
                configuration = {};

            params = params || [];

            if(method !== "get") {
                configuration.method = "post";
                if(method !== "post") {
                    params.push("_method=" + method);
                }
            }

            configuration.data = params.join("&");

            if(timer) {
                timer.cancel();
            }

            io("/games/" + id + path, configuration);
        }
    });

    Y.Game = Game;

}, '0.0.1', { requires: ["widget", "pioneers-game", "board", "exchange", "discard", "offer", "build", "cards", "before-roll"] });
