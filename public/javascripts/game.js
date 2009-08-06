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
        JOIN = "join",
        START = "start",
        QUIT = "quit",
        SETTLEMENT = "settlement",
        CITY = "city",
        EXCHANGE = "exchange",
        DISCARD = "discard",
        OFFER = "offer",
        ROBBER = "robber",
        ACCEPT = "accept",
        DECLINE = "decline",
        END_TURN = "end-turn",
        YEAR_OF_PLENTY = "year-of-plenty",
        MONOPOLY = "monopoly",
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
        TIMEOUT = 3000;

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
            this._renderGameStatus();
            this._renderJoin();
            this._renderPlayers();
            this._renderBoard();
            this._renderUserPlayer();
            this._renderExchange();
            this._renderDiscard();
            this._renderOffer();
            this._renderBuild();
            this._renderCards();
            this._renderBeforeRoll();
            this._renderAfterRoll();
            this._renderOfferSent();
            this._renderOfferReceived();
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

        _renderPlayers: function() {
            var game = this.get("game"),
                contentBox = this.get(CONTENT_BOX),
                playersNode = Node.create(DIV_TEMPLATE);

            this.players = new Y.Players({ contentBox: playersNode, game: game });
            contentBox.append(playersNode);

            this.players.render();
        },

        _renderUserPlayer: function() {
            var game = this.get("game"),
                player = game.get("userPlayer"),
                contentBox = this.get(CONTENT_BOX),
                userPlayerNode = Node.create(DIV_TEMPLATE);

            if(isValue(player)) {
                this.userPlayer = new Y.UserPlayer({ contentBox: userPlayerNode, game: game });
                contentBox.append(userPlayerNode);

                this.userPlayer.render();
            }
        },

        _renderGameStatus: function() {
            var game = this.get("game"),
                contentBox = this.get(CONTENT_BOX),
                gameStatusNode = Node.create(DIV_TEMPLATE);

            this.gameStatus = new Y.GameStatus({ contentBox: gameStatusNode, game: game });
            contentBox.append(gameStatusNode);

            this.gameStatus.render();
        },

        _renderOfferSent: function() {
            var game = this.get("game"),
                player = game.get("userPlayer"),
                contentBox = this.get(CONTENT_BOX),
                offerSentNode = Node.create(DIV_TEMPLATE);

            if(isValue(player)) {
                this.offerSent = new Y.OfferSent({ contentBox: offerSentNode, game: game });
                contentBox.append(offerSentNode);

                this.offerSent.render();
            }
        },

        _renderOfferReceived: function() {
            var game = this.get("game"),
                player = game.get("userPlayer"),
                contentBox = this.get(CONTENT_BOX),
                offerReceivedNode = Node.create(DIV_TEMPLATE);

            if(isValue(player)) {
                this.offerReceived = new Y.OfferReceived({ contentBox: offerReceivedNode, game: game });
                contentBox.append(offerReceivedNode);

                this.offerReceived.render();
            }
        },

        _renderJoin: function() {
            var game = this.get("game"),
                contentBox = this.get(CONTENT_BOX),
                joinNode = Node.create(DIV_TEMPLATE);

            this.join = new Y.Join({ contentBox: joinNode, game: game });
            contentBox.append(joinNode);

            this.join.render();
        },

        syncUI: function() {
            var game = this.get("game"),
                player = game.get("userPlayer");

            this._uiSyncGameStatus();
            this._uiSyncJoin();
            this._uiSyncPlayers();

            if(isValue(player)) {
                this._uiSyncUserPlayer();
                this._uiSyncBoard();
                this._uiSyncOffer();
                this._uiSyncExchange();
                this._uiSyncDiscard();
                this._uiSyncBuild();
                this._uiSyncCards();
                this._uiSyncBeforeRoll();
                this._uiSyncAfterRoll();
                this._uiSyncOfferSent();
                this._uiSyncOfferReceived();
            }

            if(this.timer) {
                this.timer.cancel();
            }
            this.timer = later(TIMEOUT, this, bind(this._refreshGame, this));
        },

        _success: function(id, response) {
            var gameAttributes = parse(response.responseText),
                game = this.get("game");

            game.setAttrs(gameAttributes);
            this.syncUI();
        },

        _refreshGame: function() {
            var game = this.get("game"),
                id = game.get("id"),
                uri = "/games/" + id + ".json";
            io(uri, { on: { success: bind(this._success, this) }});
        },

        _uiSyncGameStatus: function() {
            var game = this.get("game");

            this.gameStatus.syncUI();
        },

        _uiSyncJoin: function() {
            var game = this.get("game");

            this.join.syncUI();
        },

        _uiSyncPlayers: function() {
            var game = this.get("game");

            this.players.syncUI();
        },

        _uiSyncUserPlayer: function() {
            var game = this.get("game");

            this.userPlayer.syncUI();
        },

        _uiSyncBoard: function() {
            var game = this.get("game");

            this.board.syncUI();
            if(game.isUserRobber()) {
                this.board.set("mode", "robber");
            } else if(game.isUserFirstSettlement() || game.isUserSecondSettlement()) {
                this.board.set("mode", "firstSettlement");
            } else if(game.isUserFirstRoad() || game.isUserSecondRoad()) {
                this.board.set("mode", "firstRoad");
            } else if(game.isUserRoadBuildingFirstRoad() || game.isUserRoadBuildingSecondRoad()) {
                this.board.set("mode", "road");
            } else if(!game.isUserAfterRoll()) {
                this.board.set("mode", "default");
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

        _uiSyncOfferSent: function() {
            var game = this.get("game");

            this.offerSent.syncUI();
            if(game.isUserOffer()) {
                this.offerSent.show();
            } else {
                this.offerSent.hide();
            }
        },

        _uiSyncOfferReceived: function() {
            var game = this.get("game");

            this.offerReceived.syncUI();
            if(game.isOtherOffer()) {
                this.offerReceived.show();
            } else {
                this.offerReceived.hide();
            }
        },

        bindUI: function() {
            var game = this.get("game"),
                player = game.get("userPlayer");

            this.join.after(START, bind(this._afterStart, this));

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
                this.offerSent.after(DECLINE, bind(this._afterOfferSentDecline, this));
                this.offerSent.after(ACCEPT, bind(this._afterOfferSentAccept, this));
                this.offerReceived.after(ACCEPT, bind(this._afterOfferReceivedAccept, this));
                this.offerReceived.after(DECLINE, bind(this._afterOfferReceivedDecline, this));
            }
        },

        _afterStart: function(event) {
            this._io("put", "/player", ["player[state_event]=start"]);
        },

        _afterRoll: function(event) {
            this._io("post", "/dice_rolls");
        },

        _afterEndTurn: function(event) {
            this._io("put", "", ["game[phase_event]=end_turn"]);
        },

        _afterCardPlay: function(event) {
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
            var details = event.details[0],
                params = [
                    "exchange[bricks]=" + details.bricks,
                    "exchange[grain]=" + details.grain,
                    "exchange[lumber]=" + details.lumber,
                    "exchange[ore]=" + details.ore,
                    "exchange[wool]=" + details.wool
                ];

            this._io("post", "/exchanges", params);
        },

        _afterOffer: function(event) {
            var details = event.details[0],
                params = [
                    "offer[bricks]=" + details.bricks,
                    "offer[grain]=" + details.grain,
                    "offer[lumber]=" + details.lumber,
                    "offer[ore]=" + details.ore,
                    "offer[wool]=" + details.wool
                ];

            this._io("post", "/offer", params);
        },

        _afterOfferSentDecline: function(event) {
            this._io("put", "/offer", ["offer[state_event]=decline"]);
        },

        _afterOfferSentAccept: function(event) {
            var player = event.details[0];

            this._io("put", "/offer", ["offer[state_event]=accept", "offer[recipient_number]=" + player]);
        },

        _afterOfferReceivedDecline: function(event) {
            this._io("post", "/offer_response", ["offer_response[agreed]=false"]);
        },

        _afterOfferReceivedAccept: function(event) {
            this._io("post", "/offer_response", ["offer_response[agreed]=true"]);
        },

        _afterRoadBuilt: function(event) {
            var position = event.details[0],
                params = [
                    "edge[row]=" + position[0],
                    "edge[col]=" + position[1]
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

            configuration.on = {
                success: bind(this._success, this)
            };

            io("/games/" + id + path, configuration);
        }
    });

    Y.Game = Game;

}, '0.0.1', { requires: ["widget", "pioneers-game", "board", "exchange", "discard", "offer", "build", "cards", "before-roll"] });
