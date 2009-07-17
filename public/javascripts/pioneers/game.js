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

// Filters added to this controller apply to all controllers in the
// application.  Likewise, all the methods added will be available for
// all controllers.

YUI.add("pioneers-game", function(Y) {
    var pioneers = Y.namespace("pioneers"),
        GAME = "pioneers-game",
        augment = Y.augment,
        Attribute = Y.Attribute,
        merge = Y.merge,
        extend = Y.extend,
        Base = Y.Base,
        map = Y.Array.map,
        each = Y.Array.each,
        filter = Y.Array.filter,
        find = Y.Array.find,
        Offer = pioneers.Offer,
        Hex = pioneers.Hex,
        Edge = pioneers.Edge,
        Node = pioneers.Node;

    var Game = function() {
        pioneers.Game.superclass.constructor.apply(this, arguments);
    };

    Game.NAME = GAME;

    Game.ATTRS =  {
        id: {
            writeOnce: true
        },
        discardPlayer: {
        },
        discardLimit: {
        },
        phase: {
        },
        player: {
        },
        roll: {
        },
        state: {
        },
        turn: {
        },
        winner: {
        },
        cards: {
        },
        card: {
        },
        players: {
            setter: function(values) {
                var initialized = this.get("initialized");
                if(initialized) {
                    each(values, function(value) {
                        var number = values.number,
                            player = this.player(number);
                        player.setAttrs(value);
                    }, this);
                }
            }
        },
        userPlayer: {
            writeOnce: true
        },
        userCards: {
            setter: function(values) {
                var initialized = this.get("initialized");
                if(initialized) {
                    each(values, function(value) {
                        var id = value.id,
                            userCards = this.get("userCards"),
                            card = find(userCards, function(userCard) {
                                return userCard.id === id;
                            });
                        if(card) {
                            card.state = value.state;
                            return userCards;
                        } else {
                            return userCards.push(card);
                        }
                    }, this);
                }
            }
        },
        board: {
            setter: function(value) {
                var initialized = this.get("initialized");
                if(initialized) {
                    this.board.setAttrs(value);
                }
            }
        },
        offer: {
            setter: function(value) {
                var offer = this.get("offer");
                if(offer.id === value.id) {
                    offer.setAttrs(value);
                    return offer;
                } else {
                    // new offer created
                    return new Offer(value);
                }
            }
        }
    };

    extend(Game, Base, {
        initializer: function() {
            this._createBoard();
            this._createPlayers();
        },

        _createBoard: function() {
            var board = this.get("board");
            this.board = new pioneers.Board(board);
        },

        _createPlayers: function() {
            var players = this.get("players");
            this.players = map(players, function(player) {
                return new pioneers.Player(player);
            });
        },

        isUserPhase: function() {
            var userPlayer = this.get("userPlayer"),
                player = tihs.get("player");
            return userPlayer === player;
        },

        isUserFirstSettlement: function() {
            var phase = this.get("phase");
            return this.isUserPhase() && phase === "first_settlement";
        },

        isUserSecondSettlement: function() {
            var phase = this.get("phase");
            return this.isUserPhase() && phase === "second_settlement";
        },

        isUserFirstRoad: function() {
            var phase = this.get("phase");
            return this.isUserPhase() && phase === "first_road";
        },

        isUserSecondRoad: function() {
            var phase = this.get("phase");
            return this.isUserPhase() && phase === "second_road";
        },

        isUserBeforeRoll: function() {
            var phase = this.get("phase");
            return this.isUserPhase() && phase === "before_roll";
        },

        isUserAfterRoll: function() {
            var phase = this.get("phase");
            return this.isUserPhase() && phase === "after_roll";
        },

        isUserRobber: function() {
            var phase = this.get("phase");
            return this.isUserPhase() && phase === "robber";
        },

        isUserDiscard: function() {
            var discardPlayer = this.get("discardPlayer"),
                userPlayer = this.get("userPlayer"),
                phase = this.get("phase");
            return userPlayer === discardPlayer && phase === "discard";
        },

        isUserOffer: function() {
            var phase = this.get("phase");
            return isUserPhase() && phase === "offer";
        },

        isOtherOffer: function() {
            var phase = this.get("phase");
            return !this.isUserPhase() && phase === "offer";
        },

        player: function(number) {
            return find(this.players, function(player) {
                return player.get("number") === number;
            });
        },

        userPlayer: function() {
            var userPlayer = this.get("userPlayer");
            return this.player(userPlayer);
        }
    });

    pioneers.Game = Game;

}, '0.0.1', { requires: ["base", "pioneers-board", "pioneers-player", "pioneers-offer"] });
