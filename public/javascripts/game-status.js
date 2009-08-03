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

YUI.add("game-status", function(Y) {
    var GAME_STATUS = "game-status",
        LABEL = "label",
        VALUE = "value",
        ROLL = "roll",
        PHASE = "phase",
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        C_GAME_STATUS = getCN(GAME_STATUS),
        DIV_TEMPLATE = "<div></div>",
        SPAN_TEMPLATE = "<span></span>",
        LABEL_TEMPLATE = "<label></label>",
        Widget = Y.Widget,
        Node = Y.Node,
        isNumber = Y.Lang.isNumber,
        bind = Y.bind,
        each = Y.each;

    function GameStatus() {
        GameStatus.superclass.constructor.apply(this, arguments);
    }

    Y.mix(GameStatus, {
        NAME: GAME_STATUS,
        ATTRS: {
            game: {
            },
            strings: {
                value: {
                    label: "Game Status",
                    roll: "Roll",
                    phase: "Phase",
                    none: "None"
                }
            }
        }
    });

    Y.extend(GameStatus, Widget, {
        renderUI: function() {
            this._renderLabel();
            this._renderItem(ROLL);
            this._renderItem(PHASE);
        },

        _renderLabel: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var label = Y.Node.create(LABEL_TEMPLATE);
            label.set("innerHTML", strings.label);

            this.labelNode = contentBox.appendChild(label);
        },

        _renderItem: function(type) {
            var game = this.get("game"),
                value = game.get(type),
                contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings"),
                itemClassName = this.getClassName(type),
                labelClassName = this.getClassName(type, LABEL),
                valueClassName = this.getClassName(type, VALUE);

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
        },

        syncUI: function() {
            this._uiSyncRoll();
            this._uiSyncPhase();
        },

        _uiSyncRoll: function() {
            var game = this.get("game"),
                roll = game.get("roll"),
                strings = this.get("strings");

            this.rollNode.set("innerHTML", roll || strings.none);
        },

        _uiSyncPhase: function() {
            var game = this.get("game"),
                phase = game.get("phase");

            this.phaseNode.set("innerHTML", phase);
        }
    });

    Y.GameStatus = GameStatus;

}, '0.0.1', { requires: ["widget"] });
