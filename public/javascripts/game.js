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
        OFFER = "offer",
        ROBBER = "robber",
        getCN = Y.ClassNameManager.getClassName,
        C_GAME = getCN(GAME),
        CONTENT_BOX = "contentBox",
        DIV_TEMPLATE = '<div></div>',
        Widget = Y.Widget,
        Node = Y.Node,
        bind = Y.bind,
        isValue = Y.Lang.isValue,
        pioneers = Y.namespace("pioneers");

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
            }
        },

        _uiSyncBoard: function() {
            this.board.syncUI();
        },

        _uiSyncOffer: function() {
            this.offer.syncUI();
            if(game.isUserAfterRoll()) {
                this.offer.show();
            } else {
                this.offer.hide();
            }
        },

        _uiSyncExchange: function() {
            this.exchange.syncUI();
            if(game.isUserAfterRoll()) {
                this.exchange.show();
            } else {
                this.exchange.hide();
            }
        },

        _uiSyncBuild: function() {
            this.build.syncUI();
            if(game.isUserAfterRoll()) {
                this.build.show();
            } else {
                this.build.hide();
            }
        },

        _uiSyncDiscard: function() {
            this.discard.syncUI();
            if(game.isUserDiscard()) {
                this.discard.show();
            } else {
                this.discard.hide();
            }
        },

        _uiSyncCards: function() {
            this.cards.syncUI();
            if(game.isUserAfterRoll() || game.isUserBeforeRoll()) {
                this.cards.show();
            } else {
                this.cards.hide();
            }
        },

        _uiSyncBeforeRoll: function() {
            this.beforeRoll.syncUI();
            if(game.isUserBeforeRoll()) {
                this.beforeRoll.show();
            } else {
                this.beforeRoll.hide();
            }
        },

        bindUI: function() {
            this.beforeRoll.after(ROLL, bind(this._afterRoll, this));
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
        },

        _afterRoll: function(event) {
            console.log(event);
        },

        _afterCardPlay: function(event) {
            console.log(event);
        },

        _afterBuildRoad: function(event) {
            console.log(event);
        },

        _afterBuildSettlement: function(event) {
            console.log(event);
        },

        _afterBuildCity: function(event) {
            console.log(event);
        },

        _afterBuildCard: function(event) {
            console.log(event);
        },

        _afterExchange: function(event) {
            console.log(exchange);
        },

        _afterOffer: function(event) {
            console.log(event);
        },

        _afterRoadBuilt: function(event) {
            console.log(event);
        },

        _afterSettlementBuilt: function(event) {
            console.log(event);
        },

        _afterCityBuilt: function(event) {
            console.log(event);
        },

        _afterRobberMoved: function(event) {
            console.log(event);
        }
    });

    Y.Game = Game;

}, '0.0.1', { requires: ["widget", "pioneers-game", "board", "exchange", "discard", "offer", "build", "cards", "before-roll"] });
