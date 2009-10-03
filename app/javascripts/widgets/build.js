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

YUI.add("build", function(Y) {
    var BUILD = "build",
        ROAD = "road",
        SETTLEMENT = "settlement",
        CITY = "city",
        CARD = "card",
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        C_SETTLEMENT = getCN(BUILD, SETTLEMENT),
        C_CITY = getCN(BUILD, CITY),
        C_ROAD = getCN(BUILD, ROAD),
        C_CARD = getCN(BUILD, CARD),
        BUTTON_TEMPLATE = '<button type="button"></button>',
        C_LABEL = getCN(BUILD, "label"),
        LABEL_TEMPLATE = '<label class="' + C_LABEL + '"></label>',
        Widget = Y.Widget,
        Node = Y.Node,
        isNumber = Y.Lang.isNumber,
        bind = Y.bind;

    function Build() {
        Build.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Build, {
        NAME: BUILD,
        ATTRS: {
            game: {
            },
            board: {
                readOnly: true,
                getter: function() {
                    var game = this.get("game");
                    return game.board;
                }
            },
            player: {
                readOnly: true,
                getter: function() {
                    var game = this.get("game");
                    return game.get("userPlayer");
                }
            },
            resources: {
                readOnly: true,
                getter: function() {
                    var game = this.get("game"),
                        cards = game.get("cards"),
                        player = game.userPlayer(),
                        bricks = player.get("bricks"),
                        grain = player.get("grain"),
                        lumber = player.get("lumber"),
                        ore = player.get("ore"),
                        wool = player.get("wool"),
                        settlements = player.get("settlements"),
                        cities = player.get("cities"),
                        roads = player.get("roads");
                    return {
                        bricks: bricks,
                        grain: grain,
                        lumber: lumber,
                        ore: ore,
                        wool: wool,
                        settlements: settlements,
                        cities: cities,
                        roads: roads,
                        cards: cards
                    };
                }
            },
            strings: {
                value: {
                    label: "Build",
                    road: "Road",
                    settlement: "Settlement",
                    city: "City",
                    card: "Card"
                }
            }
        }
    });

    Y.extend(Build, Widget, {
        renderUI: function() {
            this._renderLabel();
            this._renderButtons();
        },

        bindUI: function() {
            this.after("disabledChange", this._afterDisabledChange);
            Y.on("click", bind(this._roadClick, this), this.roadNode);
            Y.on("click", bind(this._settlementClick, this), this.settlementNode);
            Y.on("click", bind(this._cityClick, this), this.cityNode);
            Y.on("click", bind(this._cardClick, this), this.cardNode);
        },

        _afterDisabledChange: function(event) {
            this.syncUI();
        },

        syncUI: function() {
            this._uiSyncButtons(this.get("resources"));
        },

        _roadClick: function(event) {
            if(this._isRoadEnabled(this.get("resources"))) {
                this.fire(ROAD);
            }
        },

        _settlementClick: function(event) {
            if(this._isSettlementEnabled(this.get("resources"))) {
                this.fire(SETTLEMENT);
            }
        },

        _cityClick: function(event) {
            if(this._isCityEnabled(this.get("resources"))) {
                this.fire(CITY);
            }
        },

        _cardClick: function(event) {
            if(this._isCardEnabled(this.get("resources"))) {
                this.fire(CARD);
            }
        },

        _uiSyncButtons: function(resources) {
            this.roadNode.set("disabled", !this._isRoadEnabled(resources));
            this.settlementNode.set("disabled", !this._isSettlementEnabled(resources));
            this.cityNode.set("disabled", !this._isCityEnabled(resources));
            this.cardNode.set("disabled", !this._isCardEnabled(resources));
        },

        _isRoadEnabled: function(resources) {
            var board = this.get("board"),
                player = this.get("player"),
                disabled = this.get("disabled");

            return !disabled &&
                resources.bricks > 0 &&
                resources.lumber > 0 &&
                resources.roads > 0 &&
                board.canBuildRoad(player);
        },

        _isSettlementEnabled: function(resources) {
            var board = this.get("board"),
                player = this.get("player"),
                disabled = this.get("disabled");

            return !disabled &&
                resources.bricks > 0 &&
                resources.lumber > 0 &&
                resources.grain > 0 &&
                resources.wool > 0 &&
                resources.settlements > 0 &&
                board.canBuildSettlement(player);
        },

        _isCityEnabled: function(resources) {
            var board = this.get("board"),
                player = this.get("player"),
                disabled = this.get("disabled");

            return !disabled &&
                resources.grain > 1 &&
                resources.ore > 2 &&
                resources.cities > 0 &&
                board.canBuildCity(player);
        },

        _isCardEnabled: function(resources) {
            var disabled = this.get("disabled");

            return resources.grain > 0 &&
                resources.ore > 0 &&
                resources.wool > 0 &&
                resources.cards > 0;
        },

        _renderButtons: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var road = this._createButton(strings.road, C_ROAD);
            this.roadNode = contentBox.appendChild(road);

            var settlement = this._createButton(strings.settlement, C_SETTLEMENT);
            this.settlementNode = contentBox.appendChild(settlement);

            var city = this._createButton(strings.city, C_CITY);
            this.cityNode = contentBox.appendChild(city);

            var card = this._createButton(strings.card, C_CARD);
            this.cardNode = contentBox.appendChild(card);
        },

        _renderLabel: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var label = Y.Node.create(LABEL_TEMPLATE);
            label.set("innerHTML", strings.label);

            this.labelNode = contentBox.appendChild(label);
        },

        _createButton: function(text, className) {
            var button = Y.Node.create(BUTTON_TEMPLATE);

            button.set("innerHTML", text);
            button.set("title", text);
            button.addClass(className);

            return button;
        }
    });

    Y.Build = Build;

}, '0.0.1', { requires: ["widget"] });
