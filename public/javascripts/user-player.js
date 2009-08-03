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

YUI.add("user-player", function(Y) {
    var USER_PLAYER = "user-player",
        NAME = "name",
        RESOURCES = "resources",
        CARDS = "cards",
        POINTS = "points",
        LABEL = "label",
        VALUE = "value",
        BRICKS = "bricks",
        GRAIN = "grain",
        LUMBER = "lumber",
        ORE = "ore",
        WOOL = "wool",
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        C_USER_PLAYER = getCN(USER_PLAYER),
        C_NAME = getCN(USER_PLAYER, NAME),
        C_RESOURCES = getCN(USER_PLAYER, RESOURCES),
        C_CARDS = getCN(USER_PLAYER, CARDS),
        C_POINTS = getCN(USER_PLAYER, POINTS),
        DIV_TEMPLATE = "<div></div>",
        SPAN_TEMPLATE = "<span></span>",
        LABEL_TEMPLATE = "<label></label>",
        Widget = Y.Widget,
        Node = Y.Node,
        isNumber = Y.Lang.isNumber,
        bind = Y.bind,
        each = Y.each;

    function UserPlayer() {
        UserPlayer.superclass.constructor.apply(this, arguments);
    }

    Y.mix(UserPlayer, {
        NAME: USER_PLAYER,
        ATTRS: {
            game: {
            },
            userPlayer: {
                readOnly: true,
                getter: function() {
                    var game = this.get("game");
                    return game.userPlayer();
                }
            },
            strings: {
                value: {
                    label: "User Player",
                    name: "Name",
                    bricks: "Bricks",
                    grain: "Grain",
                    lumber: "Lumber",
                    ore: "Ore",
                    wool: "Wool"
                }
            }
        }
    });

    Y.extend(UserPlayer, Widget, {
        renderUI: function() {
            this._renderLabel();
            this._renderUserPlayer();
        },

        syncUI: function() {
            this._uiSyncUserPlayer();
        },

        _uiSyncUserPlayer: function() {
            var userPlayer = this.get("userPlayer"),
                name = userPlayer.get("name"),
                bricks = userPlayer.get("bricks"),
                grain = userPlayer.get("grain"),
                lumber = userPlayer.get("lumber"),
                ore = userPlayer.get("ore"),
                wool = userPlayer.get("wool");

            this.nameNode.set("innerHTML", name);
            this.bricksNode.set("innerHTML", bricks);
            this.grainNode.set("innerHTML", grain);
            this.lumberNode.set("innerHTML", lumber);
            this.oreNode.set("innerHTML", ore);
            this.woolNode.set("innerHTML", wool);
        },

        _renderLabel: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var label = Y.Node.create(LABEL_TEMPLATE);
            label.set("innerHTML", strings.label);

            this.labelNode = contentBox.appendChild(label);
        },

        _renderUserPlayer: function() {
            var userPlayer = this.get("userPlayer"),
                number = userPlayer.number,
                className = this.getClassName(USER_PLAYER, number);

            this._renderItem(NAME);
            this._renderItem(BRICKS);
            this._renderItem(GRAIN);
            this._renderItem(LUMBER);
            this._renderItem(ORE);
            this._renderItem(WOOL);
        },

        _renderItem: function(type) {
            var userPlayer = this.get("userPlayer"),
                number = userPlayer.number,
                value = userPlayer.get(type),
                strings = this.get("strings"),
                itemClassName = this.getClassName(type),
                labelClassName = this.getClassName(type, LABEL),
                valueClassName = this.getClassName(type, VALUE),
                contentBox = this.get(CONTENT_BOX);

            var itemNode = Node.create(DIV_TEMPLATE);
            contentBox.appendChild(itemNode);
            itemNode.addClass(itemClassName);

            var labelNode = Node.create(LABEL_TEMPLATE);
            itemNode.appendChild(labelNode);
            labelNode.addClass(labelClassName);
            labelNode.set("innerHTML", strings[type]);

            var valueNode = Node.create(SPAN_TEMPLATE);
            itemNode.appendChild(valueNode);
            valueNode.addClass(valueClassName);
            valueNode.set("innerHTML", value);

            this[type + "Node"] = valueNode;
        }
    });

    Y.UserPlayer = UserPlayer;

}, '0.0.1', { requires: ["widget"] });
