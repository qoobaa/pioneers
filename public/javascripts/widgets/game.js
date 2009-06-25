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
        $.getJSON("/games/" + this.options.id + "/cards.json", function(data) {
            that._cardsDataLoaded(data);
        });
    },

    _userPlayer: function() {
        var that = this;
        return $.grep(this.options.players, function(player) {
            return player.number === that.options.userPlayerNumber;
        })[0];
    },

    _userCards: function() {
        return this.options.userCards;
    },

    _cardsDataLoaded: function(data) {
        this.options.userCards = data.cards;
        this._createBoard();
        this._createGameinfo();
        this._createPlayers();
        this._createUserPlayer();
        this._createBuild();
        this._createEndTurn();
        this._createBeforeRoll();
        this._createDiscard();
        this._createOffer();
        this._createExchange();
        this._createUserOffer();
        this._createOtherOffer();
        this._createYearOfPlenty();
        this._createMonopoly();
        this._createCards();
        this._setupStomp();
        this._refresh();
    },

    _createBoard: function() {
        var that = this;
        this.board = $("<div/>").appendTo(this.element).board({ boardAttributes: this.options.board });

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
                "node[row]": position[0],
                "node[col]": position[1],
                "node[state_event]": "settle"
            };
            $.post("/games/" + that.options.id + "/nodes", data);
            that.build.build("enable");
        });

        this.board.bind("boardcitybuilt", function(event, position) {
            var data = {
                _method: "put",
                "node[state_event]": "expand"
            };
            $.post("/games/" + that.options.id + "/nodes/" + position.join(","), data);
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

    _createGameinfo: function() {
        this.gameinfo = $("<div/>").appendTo(this.element).gameinfo(this.options);
    },

    _createPlayers: function() {
        var that = this;
        $.each(this.options.players, function() {
            that["player" + this.number] = $("<div/>").appendTo(that.element).player(this);
        });
    },

    _createUserPlayer: function() {
        if(this._userPlayer() !== undefined) {
            this.userPlayer = $("<div/>").appendTo(this.element).userplayer(this._userPlayer());
        }
    },

    _createBuild: function() {
        var that = this;
        this.build = $("<div/>").appendTo(this.element).build().hide();
        this.build.bind("buildsettlementclick", function(event) {
            that._trigger("message", null, ["info", "select place for settlement"]);
            that.endTurn.hide();
            that.exchange.hide();
            that.offer.hide();
            that.build.hide();
            that.cards.hide();
            that.board.board("buildSettlementMode", that._userPlayer().number);
        });
        this.build.bind("buildcityclick", function() {
            that._trigger("message", null, ["info", "select settlement to expand"]);
            that.endTurn.hide();
            that.exchange.hide();
            that.offer.hide();
            that.build.hide();
            that.cards.hide();
            that.board.board("buildCityMode", that._userPlayer().number);
        });
        this.build.bind("buildroadclick", function() {
            that._trigger("message", null, ["info", "select place for road"]);
            that.endTurn.hide();
            that.exchange.hide();
            that.offer.hide();
            that.build.hide();
            that.cards.hide();
            that.board.board("buildRoadMode", that._userPlayer().number);
        });
        this.build.bind("buildcardclick", function() {
            that.endTurn.hide();
            that.exchange.hide();
            that.offer.hide();
            that.build.hide();
            that.cards.hide();
            var data = {
                nothing: true
            };
            $.post("/games/" + that.options.id + "/cards", data);
        });
    },

    _createEndTurn: function() {
        var that = this;
        this.endTurn = $("<a/>").addClass("end-turn").text("End turn").attr("href", "").hide().appendTo(this.element).click(function() {
            that.endTurn.hide();
            that.exchange.hide();
            that.offer.hide();
            that.build.hide();
            that.cards.hide();
            var data = {
                _method : "put",
                "game[phase_event]": "end_turn"
            };
            $.post("/games/" + that.options.id, data);
            return false;
        });
    },

    _createBeforeRoll: function() {
        var that = this;
        this.beforeRoll = $("<div/>").appendTo(this.element).beforeroll();
        this.beforeRoll.bind("beforerollarmycardplayed", function(event, card) {
            var data = {
                "card[state_event]": "play"
            };
            $.post("/games/" + that.options.id + "/cards/" + card.id, data);
            return false;
        });
        this.beforeRoll.bind("beforerolldicerolled", function(event) {
            var data = {
                nothing: true
            };
            $.post("/games/" + that.options.id + "/dice_rolls", data);
            return false;
        });
    },

    _createDiscard: function() {
        var that = this;
        this.discard = $("<div/>").appendTo(this.element).discard(this._userPlayer()).hide().bind("discardaccept", function(event, bricks, grain, lumber, ore, wool) {
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

    _createOffer: function() {
        var that = this;
        this.offer = $("<div/>").appendTo(this.element).offer(this._userPlayer()).hide().bind("offeraccept", function(event, bricks, grain, lumber, ore, wool) {
            that.endTurn.hide();
            that.exchange.hide();
            that.offer.hide();
            that.build.hide();
            that.cards.hide();
            var data = {
                "offer[bricks]": bricks,
                "offer[grain]": grain,
                "offer[lumber]": lumber,
                "offer[ore]": ore,
                "offer[wool]": wool
            };
            $.post("/games/" + that.options.id + "/offer", data);
        });
    },

    _createExchange: function() {
        var that = this;
        this.exchange = $("<div/>").appendTo(this.element).exchange(this._userPlayer()).hide().bind("exchangeaccept", function(event, bricks, grain, lumber, ore, wool) {
            that.endTurn.hide();
            that.exchange.hide();
            that.offer.hide();
            that.build.hide();
            that.cards.hide();
            var data = {
                "exchange[bricks]": bricks,
                "exchange[grain]": grain,
                "exchange[lumber]": lumber,
                "exchange[ore]": ore,
                "exchange[wool]": wool
            };
            $.post("/games/" + that.options.id + "/exchanges", data);
        });
    },

    _createUserOffer: function() {
        var that = this;
        this.userOffer = $("<div/>").appendTo(this.element).useroffer(this.options.offer).hide().bind("userofferaccepted", function(event, player) {
            var data = {
                "_method": "put",
                "offer[state_event]": "accept",
                "offer[recipient_number]": player
            };
            $.post("/games/" + that.options.id + "/offer", data);
        }).bind("useroffercancelled", function(event) {
            var data = {
                "_method": "put",
                "offer[state_event]": "decline"
            };
            $.post("/games/" + that.options.id + "/offer", data);
        });
        if(this.options.offer != undefined) {
            $.each(this.options.offer.responses, function(key, value) {
                that.userOffer.useroffer("response", value);
            });
        }
    },

    _createOtherOffer: function() {
        var that = this;
        this.otherOffer = $("<div/>").appendTo(this.element).otheroffer(this.options.offer).hide().bind("otherofferaccepted", function(event) {
            var data = {
                "offer_response[agreed]": true
            };
            $.post("/games/" + that.options.id + "/offer_response", data);
        }).bind("otherofferdeclined", function(event) {
            var data = {
                "offer_response[agreed]": false
            };
            $.post("/games/" + that.options.id + "/offer_response", data);
        });
    },

    _createYearOfPlenty: function() {
        var that = this;
        this.yearOfPlenty = $("<div/>").appendTo(this.element).yearofplenty().hide().bind("yearofplentyaccept", function(event, card, resources) {
            $(this).hide();
            var data = {
                "_method": "put",
                "card[state_event]": "play",
                "card[bricks]": resources.bricks,
                "card[grain]": resources.grain,
                "card[lumber]": resources.lumber,
                "card[ore]": resources.ore,
                "card[wool]": resources.wool
            };
            $.post("/games/" + that.options.id + "/cards/" + card.id, data);
        });
    },

    _createMonopoly: function() {
        var that = this;
        this.monopoly = $("<div/>").appendTo(this.element).monopoly().hide().bind("monopolychosen", function(event, card, resource) {
            $(this).hide();
            var data = {
                "_method": "put",
                "card[state_event]": "play",
                "card[resource_type]": resource
            };
            $.post("/games/" + that.options.id + "/cards/" + card.id, data);
        });
    },

    _createCards: function() {
        var that = this;
        this.cards = $("<div/>").appendTo(this.element).cards().hide().bind("cardsplayed", function(event, card) {
            switch(card.type) {
            case "Card::Army":
            case "Card::RoadBuilding":
                that.build.hide();
                that.exchange.hide();
                that.offer.hide();
                that.endTurn.hide();
                that.cards.hide();
                var data = {
                    "_method": "put",
                    "card[state_event]": "play"
                };
                $.post("/games/" + that.options.id + "/cards/" + card.id, data);
                break;
            case "Card::Monopoly":
                that.build.hide();
                that.exchange.hide();
                that.offer.hide();
                that.endTurn.hide();
                that.cards.hide();
                that._trigger("message", null, ["info", "select resource type"]);
                that.monopoly.monopoly("card", card).show();
                break;
            case "Card::YearOfPlenty":
                that.build.hide();
                that.exchange.hide();
                that.offer.hide();
                that.endTurn.hide();
                that.cards.hide();
                that._trigger("message", null, ["info", "choose two resources"]);
                that.yearOfPlenty.yearofplenty("card", card).show();
                break;
            }
            return false;
        });
    },

    // STOMP part

    _setupStomp: function() {
        var that = this;
        document.domain = document.domain;
        Orbited.settings.hostname = "pioneers";
        Orbited.settings.port = "8000";
        Orbited.settings.log = true;
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
        this.stomp.connect("pioneers", "61613");
    },

    _stompConnected: function(frame) {
        this.stomp.subscribe(document.location.pathname);
    },

    _stompMessageReceived: function(frame) {
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
        this.options.offer = offer;
        this.userOffer.useroffer("offer", offer);
        this.otherOffer.otheroffer("offer", offer);
    },

    // offerResponse: { player: 1, agreed: true }
    _offerResponseReceived: function(response) {
        this.options.offer.responses = this.options.offer.responses || [];
        this.options.offer.responses.push(response);
        this.userOffer.useroffer("response", response);
    },

    // exchange: { player: 1, bricks: 0, grain: -4, lumber: 1, ore: 0, wool: 0 }
    _exchangeReceived: function(exchange) {
        this._trigger("message", null, ["info", "player " + exchange.player + " exchanged some resources"]); // TODO
    },

    // discard: { player: 1, bricks: 0, grain: -4, lumber: 0, ore: 0, wool: 0 }
    _discardReceived: function(discard) {
        this._trigger("message", null, ["info", "player " + discard.player + " discarded some resources"]); // TODO
    },

    // card: { player: 1, id: 5, state: "tapped", bricks: 0, grain: 0, lumber: 0, ore: 0, wool: 0, resource: null, type: "Card" }
    _cardReceived: function(card) {
        this._reloadUserCards();
    },

    _reloadUserCards: function() {
        var that = this;
        $.getJSON("/games/" + this.options.id + "/cards.json", function(data) {
            that.options.userCards = data.cards;
            that._refresh();
        });
    },

    // refresh
    _refresh: function() {
        var that = this;

        this._trigger("clear");

        // refresh gameinfo
        this.gameinfo.gameinfo("update", this.options);

        // refresh players
        $.each(this.options.players, function(key, value) {
            that["player" + value.number].player("current", value.number === that.options.player).player("update", value);
        });

        if(this._userPlayer() !== undefined) {
            // refresh userPlayer
            this.userPlayer.userplayer("update", this._userPlayer());
            this.discard.discard("resources", this._userPlayer());
            this.offer.offer("resources", this._userPlayer());
            this.otherOffer.otheroffer("resources", this._userPlayer());

            this.exchange.exchange("resources", { bricks: this._userPlayer().bricks,
                                                  bricksRate: this._userPlayer().bricksRate,
                                                  grain: this._userPlayer().grain,
                                                  grainRate: this._userPlayer().grainRate,
                                                  lumber: this._userPlayer().lumber,
                                                  lumberRate: this._userPlayer().lumberRate,
                                                  ore: this._userPlayer().ore,
                                                  oreRate: this._userPlayer().oreRate,
                                                  wool: this._userPlayer().wool,
                                                  woolRate: this._userPlayer().woolRate });

            this.otherOffer.otheroffer("resources", { bricks: this._userPlayer().bricks,
                                                      grain: this._userPlayer().grain,
                                                      lumber: this._userPlayer().lumber,
                                                      ore: this._userPlayer().ore,
                                                      wool: this._userPlayer().wool,
                                                      settlements: this._userPlayer().settlements });

            this.build.build("resources", { bricks: this._userPlayer().bricks,
                                            grain: this._userPlayer().grain,
                                            lumber: this._userPlayer().lumber,
                                            ore: this._userPlayer().ore,
                                            wool: this._userPlayer().wool,
                                            settlements: this._userPlayer().settlements,
                                            cities: this._userPlayer().cities,
                                            roads: this._userPlayer().roads,
                                            cards: this.options.cards });

            this.beforeRoll.beforeroll("update", { cards: this._userCards() });

            this.cards.cards("update", { cards: this._userCards(),
                                         cardPlayed: this.options.cardPlayed });
        }

        if(this._isUserFirstSettlement()) {
            this._trigger("message", null, ["info", "build your first settlement"]);
            this.board.board("buildFirstSettlementMode", this._userPlayer().number);
        }

        if(this._isUserFirstRoad()) {
            this._trigger("message", null, ["info", "build your first road"]);
            this.board.board("buildFirstRoadMode", this._userPlayer().number);
        }

        if(this._isUserSecondSettlement()) {
            this._trigger("message", null, ["info", "build your second settlement"]);
            this.board.board("buildFirstSettlementMode", this._userPlayer().number);
        }

        if(this._isUserSecondRoad()) {
            this._trigger("message", null, ["info", "build your second road"]);
            this.board.board("buildFirstRoadMode", this._userPlayer().number);
        }

        if(this._isUserDiscard()) {
            this._trigger("message", null, ["info", "discard " + (this._userPlayer().resources - this.options.discardLimit) + " resources"]);
            this.discard.discard("limit", this.options.discardLimit);
            this.discard.show();
        } else {
            this.discard.hide();
        }

        if(this._isUserBeforeRoll()) {
            this._trigger("message", null, ["info", "roll the dice or play army card"]);
            this.beforeRoll.show();
        } else {
            this.beforeRoll.hide();
        }

        if(this._isUserAfterRoll()) {
            this._trigger("message", null, ["info", "click end turn after you finish"]);
            this.endTurn.show();
            this.cards.show();
            this.exchange.show();
            this.offer.show();
            this.build.show();
        } else {
            this.endTurn.hide();
            this.cards.hide();
            this.exchange.hide();
            this.offer.hide();
            this.build.hide();
        }

        if(this._isUserRobber()) {
            this._trigger("message", null, ["info", "move the robber and select settlement or city to rob (if any)"]);
            this.board.board("moveRobberMode", this._userPlayer().number);
        }

        if(this._isUserOffer()) {
            this._trigger("message", null, ["info", "wait for responses and select player you want to trade with or cancel the offer"]);
            this.userOffer.show();
        } else {
            this.userOffer.hide();
        }

        if(this._isOtherOffer()) {
            this._trigger("message", null, ["info", "player " + this.options.player + " wants to trade"]);
            this.otherOffer.show();
        } else {
            this.otherOffer.hide();
        }
    },

    // helpers
    _isUserPhase: function() {
        return this.options.userPlayerNumber === this.options.player;
    },

    _isUserFirstSettlement: function() {
        return this._isUserPhase() && this.options.phase === "first_settlement";
    },

    _isUserSecondSettlement: function() {
        return this._isUserPhase() && this.options.phase === "second_settlement";
    },

    _isUserFirstRoad: function() {
        return this._isUserPhase() && this.options.phase === "first_road";
    },

    _isUserSecondRoad: function() {
        return this._isUserPhase() && this.options.phase === "second_road";
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
        return this.options.userPlayerNumber === this.options.discardPlayer && this.options.phase === "discard";
    },

    _isUserOffer: function() {
        return this._isUserPhase() && this.options.phase === "offer";
    },

    _isOtherOffer: function() {
        return !this._isUserPhase() && this.options.phase === "offer";
    }
});
