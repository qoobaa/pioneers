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

YUI.add("monopoly", function(Y) {
    var MONOPOLY = "monopoly",
        BRICKS = "bricks",
        GRAIN = "grain",
        LUMBER = "lumber",
        ORE = "ore",
        WOOL = "wool",
        CARD = "card",
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        C_BRICKS = getCN(MONOPOLY, BRICKS),
        C_GRAIN = getCN(MONOPOLY, GRAIN),
        C_LUMBER = getCN(MONOPOLY, LUMBER),
        C_ORE = getCN(MONOPOLY, ORE),
        C_WOOL = getCN(MONOPOLY, WOOL),
        BUTTON_TEMPLATE = '<button type="button"></button>',
        C_LABEL = getCN(MONOPOLY, "label"),
        LABEL_TEMPLATE = '<label class="' + C_LABEL + '"></label>',
        Widget = Y.Widget,
        Node = Y.Node,
        isNumber = Y.Lang.isNumber,
        bind = Y.bind;

    function Monopoly() {
        Monopoly.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Monopoly, {
        NAME: MONOPOLY,
        ATTRS: {
            card: {
                value: null
            },
            strings: {
                value: {
                    label: "Monopoly",
                    bricks: "Bricks",
                    grain: "Grain",
                    lumber: "Lumber",
                    ore: "Ore",
                    wool: "Wool"
                }
            }
        }
    });

    Y.extend(Monopoly, Widget, {
        renderUI: function() {
            this._renderLabel();
            this._renderButtons();
        },

        bindUI: function() {
            this.after("cardChange", bind(this._afterCardChange, this));
            Y.on("click", bind(this._buttonClicked, this, BRICKS), this.bricksNode);
            Y.on("click", bind(this._buttonClicked, this, GRAIN), this.grainNode);
            Y.on("click", bind(this._buttonClicked, this, LUMBER), this.lumberNode);
            Y.on("click", bind(this._buttonClicked, this, ORE), this.oreNode);
            Y.on("click", bind(this._buttonClicked, this, WOOL), this.woolNode);
        },

        _buttonClicked: function(type) {
            var card = this.get("card");
            this.set("card", null);
            this.fire(MONOPOLY, { id: card.id, resourceType: type });
        },

        _afterCardChange: function(event) {
            this._uiSyncButtons(event.newVal);
        },

        syncUI: function() {
            this._uiSyncButtons(this.get("card"));
        },

        _uiSyncButtons: function(card) {
            var contentBox = this.get(CONTENT_BOX);
            contentBox.queryAll("button").set("disabled", card === null);
        },

        _renderButtons: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var bricks = this._createButton(strings.bricks, C_BRICKS);
            this.bricksNode = contentBox.appendChild(bricks);

            var grain = this._createButton(strings.grain, C_GRAIN);
            this.grainNode = contentBox.appendChild(grain);

            var lumber = this._createButton(strings.lumber, C_LUMBER);
            this.lumberNode = contentBox.appendChild(lumber);

            var ore = this._createButton(strings.ore, C_ORE);
            this.oreNode = contentBox.appendChild(ore);

            var wool = this._createButton(strings.wool, C_WOOL);
            this.woolNode = contentBox.appendChild(wool);
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

    Y.Monopoly = Monopoly;

}, '0.0.1', { requires: ["widget"] });
