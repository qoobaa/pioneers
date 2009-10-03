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

YUI.add("players", function(Y) {
    var PLAYERS = "players",
        PLAYER = "player",
        NAME = "name",
        RESOURCES = "resources",
        CARDS = "cards",
        POINTS = "points",
        LABEL = "label",
        VALUE = "value",
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        C_PLAYERS = getCN(PLAYERS),
        C_NAME = getCN(PLAYERS, NAME),
        C_RESOURCES = getCN(PLAYERS, RESOURCES),
        C_CARDS = getCN(PLAYERS, CARDS),
        C_POINTS = getCN(PLAYERS, POINTS),
        DIV_TEMPLATE = "<div></div>",
        SPAN_TEMPLATE = "<span></span>",
        LABEL_TEMPLATE = "<label></label>",
        Widget = Y.Widget,
        Node = Y.Node,
        isNumber = Y.Lang.isNumber,
        bind = Y.bind,
        each = Y.each;

    function Players() {
        Players.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Players, {
        NAME: PLAYERS,
        ATTRS: {
            game: {
            },
            players: {
                readOnly: true,
                getter: function() {
                    var game = this.get("game");
                    return game.get("players");
                }
            },
            strings: {
                value: {
                    label: "Players",
                    name: "Name",
                    resources: "Resources",
                    cards: "Cards",
                    points: "Points"
                }
            }
        }
    });

    Y.extend(Players, Widget, {
        initializer: function() {
            this.playerNodes = [];
            this.nameNodes = [];
            this.resourcesNodes = [];
            this.cardsNodes = [];
            this.pointsNodes = [];
        },

        renderUI: function() {
            var players = this.get("players");

            this._renderLabel();
            each(players, function(player) {
                this._renderPlayer(player);
            }, this);
        },

        syncUI: function() {
            var players = this.get("players");

            each(players, function(player) {
                this._uiSyncPlayer(player);
            }, this);
        },

        _uiSyncPlayer: function(player) {
            var number = player.get("number"),
                name = player.get("name"),
                resources = player.get("resources"),
                cards = player.get("cards"),
                points = player.get("points");

            this.nameNodes[number].set("innerHTML", name);
            this.resourcesNodes[number].set("innerHTML", resources);
            this.cardsNodes[number].set("innerHTML", cards);
            this.pointsNodes[number].set("innerHTML", points);
        },

        _renderLabel: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var label = Y.Node.create(LABEL_TEMPLATE);
            label.set("innerHTML", strings.label);

            this.labelNode = contentBox.appendChild(label);
        },

        _renderPlayer: function(player) {
            var number = player.get("number"),
                contentBox = this.get(CONTENT_BOX),
                className = this.getClassName(PLAYER, number);

            var playerNode = Node.create(DIV_TEMPLATE);
            contentBox.appendChild(playerNode);
            playerNode.addClass(className);

            this.playerNodes[number] = playerNode;
            this._renderItem(NAME, player);
            this._renderItem(RESOURCES, player);
            this._renderItem(CARDS, player);
            this._renderItem(POINTS, player);
        },

        _renderItem: function(type, player) {
            var number = player.get("number"),
                value = player[type],
                playerNode = this.playerNodes[number],
                strings = this.get("strings"),
                itemClassName = this.getClassName(type),
                labelClassName = this.getClassName(type, LABEL),
                valueClassName = this.getClassName(type, VALUE);

            var itemNode = Node.create(DIV_TEMPLATE);
            playerNode.appendChild(itemNode);
            itemNode.addClass(itemClassName);

            var labelNode = Node.create(LABEL_TEMPLATE);
            itemNode.appendChild(labelNode);
            labelNode.addClass(labelClassName);
            labelNode.set("innerHTML", strings[type]);

            var valueNode = Node.create(SPAN_TEMPLATE);
            itemNode.appendChild(valueNode);
            valueNode.addClass(valueClassName);
            valueNode.set("innerHTML", value);

            this[type + "Nodes"][number] = valueNode;
        }
    });

    Y.Players = Players;

}, '0.0.1', { requires: ["widget"] });
